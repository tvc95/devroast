import { createTRPCRouter, baseProcedure } from "./index";
import { db } from "@/db";
import { roasts, analysisItems } from "@/db/schema";
import { eq, asc, count, avg, gte, and } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateRoastAnalysis } from "./analysis";
import { generateDiff } from "./utils/diff";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora

const createRoastInput = z.object({
  code: z.string().min(1).max(5000),
  language: z.string(),
  roastMode: z.boolean(),
});

export const appRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    const [result] = await db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: result.totalRoasts,
      avgScore: Number(result.avgScore ?? 0),
    };
  }),

  getLeaderboard: baseProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const results = await db
        .select()
        .from(roasts)
        .orderBy(asc(roasts.score))
        .limit(input.limit);

      return results.map((row) => ({
        id: row.id,
        score: row.score,
        language: row.language,
        code: row.code,
      }));
    }),

  createRoast: baseProcedure
    .input(createRoastInput)
    .mutation(async ({ input, ctx }) => {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

      const [{ recentCount }] = await db
        .select({ recentCount: count() })
        .from(roasts)
        .where(
          and(
            eq(roasts.ip, ctx.ip),
            gte(roasts.createdAt, windowStart),
          ),
        );

      if (recentCount >= RATE_LIMIT_MAX) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `rate limit exceeded — max ${RATE_LIMIT_MAX} roasts per hour`,
        });
      }

      const analysis = await generateRoastAnalysis(
        input.code,
        input.language,
        input.roastMode
      );

      const diff = generateDiff(input.code, analysis.suggestedCode);

      const [roast] = await db
        .insert(roasts)
        .values({
          code: input.code,
          language: input.language,
          lineCount: input.code.split("\n").length,
          roastMode: input.roastMode,
          score: analysis.score,
          verdict: analysis.verdict,
          roastQuote: analysis.roastQuote,
          suggestedFix: diff,
          ip: ctx.ip,
        })
        .returning();

      if (analysis.items.length > 0) {
        await db.insert(analysisItems).values(
          analysis.items.map((item, index) => ({
            roastId: roast.id,
            severity: item.severity,
            title: item.title,
            description: item.description,
            order: index,
          }))
        );
      }

      return { id: roast.id };
    }),

  getRoastById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const roastList = await db
        .select()
        .from(roasts)
        .where(eq(roasts.id, input.id))
        .limit(1);

      if (!roastList[0]) {
        return null;
      }

      const items = await db
        .select()
        .from(analysisItems)
        .where(eq(analysisItems.roastId, input.id))
        .orderBy(asc(analysisItems.order));

      return {
        ...roastList[0],
        analysisItems: items,
      };
    }),
});

export type AppRouter = typeof appRouter;
