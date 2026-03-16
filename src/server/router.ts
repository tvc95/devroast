import { asc, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { analysisItems, roasts } from "@/db/schema";
import { generateRoastAnalysis } from "./analysis";
import { baseProcedure, createTRPCRouter } from "./index";
import { generateDiff } from "./utils/diff";

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

  getLeaderboard: baseProcedure.query(async () => {
    const results = await db
      .select()
      .from(roasts)
      .orderBy(asc(roasts.score))
      .limit(3);

    return results.map((row) => ({
      id: row.id,
      score: row.score,
      language: row.language,
      code: row.code,
    }));
  }),

  getFullLeaderboard: baseProcedure.query(async () => {
    const results = await db
      .select()
      .from(roasts)
      .orderBy(asc(roasts.score))
      .limit(20);

    return results.map((row) => ({
      id: row.id,
      score: row.score,
      language: row.language,
      code: row.code,
    }));
  }),

  createRoast: baseProcedure
    .input(createRoastInput)
    .mutation(async ({ input }) => {
      const analysis = await generateRoastAnalysis(
        input.code,
        input.language,
        input.roastMode,
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
          })),
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
