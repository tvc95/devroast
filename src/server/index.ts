import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { db } from "@/db";

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const createTRPCContext = cache(async (opts?: { req?: Request }) => {
  const ip = opts?.req
    ? (opts.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
       opts.req.headers.get("x-real-ip") ??
       "unknown")
    : "unknown";

  return { db, ip };
});

const t = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
