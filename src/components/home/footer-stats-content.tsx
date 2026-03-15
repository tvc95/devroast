"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

export function FooterStatsContent({
  initialTotalRoasts = 0,
  initialAvgScore = 0,
}: {
  initialTotalRoasts?: number;
  initialAvgScore?: number;
}) {
  const [totalRoasts, setTotalRoasts] = useState(initialTotalRoasts);
  const [avgScore, setAvgScore] = useState(initialAvgScore);

  useEffect(() => {
    setTotalRoasts(initialTotalRoasts);
    setAvgScore(initialAvgScore);
  }, [initialTotalRoasts, initialAvgScore]);

  return (
    <>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        <NumberFlow value={totalRoasts} /> codes roasted
      </span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">·</span>
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
