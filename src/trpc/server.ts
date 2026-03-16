import "server-only";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "@/server";
import { appRouter } from "@/server/router";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
      },
    },
  });
}

export const getQueryClient = cache(makeQueryClient);

const createCaller = createCallerFactory(appRouter);
const getCaller = () => createCaller(createTRPCContext());

export const caller = {
  getStats: async () => {
    const ctx = await createTRPCContext();
    const c = createCaller(ctx);
    return c.getStats();
  },
};

export const trpc = {
  getStats: {
    queryOptions: async () => {
      const data = await caller.getStats();
      return {
        queryKey: ["getStats"] as const,
        queryFn: () => Promise.resolve(data),
      };
    },
  },
};

export { dehydrate, HydrationBoundary };
