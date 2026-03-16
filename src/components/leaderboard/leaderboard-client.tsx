"use client";

import { Suspense } from "react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { LeaderboardCodeCell } from "@/components/leaderboard/leaderboard-code-cell";

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-sm border border-[var(--border-primary)] bg-[var(--bg-surface)]"
        >
          <div className="flex h-12 items-center justify-between border-b border-[var(--border-primary)] px-5">
            <div className="flex items-center gap-4">
              <span className="inline-block h-6 w-8 animate-pulse rounded bg-[var(--text-tertiary)]/20" />
              <span className="inline-block h-4 w-20 animate-pulse rounded bg-[var(--text-tertiary)]/20" />
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block h-5 w-16 animate-pulse rounded bg-[var(--text-tertiary)]/20" />
              <span className="inline-block h-4 w-12 animate-pulse rounded bg-[var(--accent-red)]/20" />
            </div>
          </div>
          <div className="h-32 animate-pulse bg-[var(--bg-surface)]" />
        </div>
      ))}
    </div>
  );
}

function LeaderboardContent() {
  const { data: leaderboard, isLoading: loadingLeaderboard } = trpc.getLeaderboard.useQuery({}, { staleTime: 3600000 });
  const { data: stats, isLoading: loadingStats } = trpc.getStats.useQuery(undefined, { staleTime: 3600000 });

  const isLoading = loadingLeaderboard || loadingStats;

  if (isLoading || !leaderboard || !stats) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5">
      {leaderboard.map((entry, index) => (
        <Link
          key={entry.id}
          href={`/roast/${entry.id}`}
          className="group flex flex-col rounded-sm border border-[var(--border-primary)] transition-colors hover:border-[var(--accent-red)]"
        >
          <div className="flex h-12 items-center justify-between border-b border-[var(--border-primary)] px-5">
            <div className="flex items-center gap-4">
              <span
                className={`font-mono text-lg font-bold text-[var(--accent-amber)]`}
              >
                #{index + 1}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-sm bg-[var(--bg-input)] px-2 py-1 font-mono text-xs text-[var(--text-secondary)]">
                {entry.language}
              </span>
              <span className="font-mono text-xs text-[var(--text-tertiary)]">
                score:{" "}
                <span className="text-[var(--accent-red)]">{entry.score.toFixed(1)}</span>
                /10
              </span>
            </div>
          </div>

          <div className="p-4">
            <LeaderboardCodeCell code={entry.code} language={entry.language} maxLines={10} />
          </div>
        </Link>
      ))}
    </div>
  );
}

export function LeaderboardList() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  );
}
