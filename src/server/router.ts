import { createTRPCRouter, baseProcedure } from "./index";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { count, avg, sql } from "drizzle-orm";

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
});

export type AppRouter = typeof appRouter;
