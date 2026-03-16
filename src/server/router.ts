import { createTRPCRouter, baseProcedure } from "./index";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { count, avg, sql } from "drizzle-orm";
import { asc } from "drizzle-orm";

export const appRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    const [result] = await db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: result.totalRoasts ?? 0,
      avgScore: result.avgScore ? Number(result.avgScore) : 0,
    };
  }),

  getLeaderboard: baseProcedure.query(async () => {
    const results = await db
      .select({
        id: roasts.id,
        score: roasts.score,
        language: roasts.language,
        code: roasts.code,
      })
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
      .select({
        id: roasts.id,
        score: roasts.score,
        language: roasts.language,
        code: roasts.code,
      })
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
});

export type AppRouter = typeof appRouter;
