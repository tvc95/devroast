"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";

export function FooterStatsContent() {
  const { data } = trpc.getStats.useQuery();

  const [totalRoasts, setTotalRoasts] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (data) {
      setTotalRoasts(data.totalRoasts);
      setAvgScore(data.avgScore);
    }
  }, [data]);

  return (
    <>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        <NumberFlow value={totalRoasts} /> codes roasted
      </span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        ·
      </span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        avg score:{" "}
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </>
  );
}
