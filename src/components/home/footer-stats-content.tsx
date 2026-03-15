"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function FooterStatsContent() {
  const { data } = trpc.getStats.useQuery();

  if (!data) {
    return (
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        loading...
      </span>
    );
  }

  return (
    <>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        <NumberFlow value={data.totalRoasts} /> codes roasted
      </span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">·</span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        avg score: <NumberFlow value={data.avgScore} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />/10
      </span>
    </>
  );
}
