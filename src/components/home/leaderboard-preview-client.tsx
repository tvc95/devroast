"use client";

import { Suspense } from "react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import {
  Leaderboard,
  LeaderboardCell,
  LeaderboardFooter,
  LeaderboardHeader,
  LeaderboardRow,
} from "@/components/home/leaderboard-preview";
import { LeaderboardCodeCell } from "@/components/home/leaderboard-code-cell";

function LeaderboardSkeleton() {
  return (
    <Leaderboard>
      <LeaderboardHeader />
      {[1, 2, 3].map((i) => (
        <LeaderboardRow key={i}>
          <LeaderboardCell className="w-12">
            <span className="inline-block h-4 w-6 animate-pulse rounded bg-[var(--text-tertiary)]/20" />
          </LeaderboardCell>
          <LeaderboardCell className="w-16">
            <span className="inline-block h-4 w-10 animate-pulse rounded bg-[var(--accent-red)]/20" />
          </LeaderboardCell>
          <LeaderboardCell className="flex-1">
            <div className="flex flex-col gap-1">
              <span className="inline-block h-4 w-full max-w-[200px] animate-pulse rounded bg-[var(--text-tertiary)]/20" />
              <span className="inline-block h-4 w-full max-w-[150px] animate-pulse rounded bg-[var(--text-tertiary)]/20" />
            </div>
          </LeaderboardCell>
          <LeaderboardCell className="w-24">
            <span className="inline-block h-4 w-16 animate-pulse rounded bg-[var(--text-tertiary)]/20" />
          </LeaderboardCell>
        </LeaderboardRow>
      ))}
      <LeaderboardFooter>
        <span className="inline-block h-4 w-40 animate-pulse rounded bg-[var(--text-tertiary)]/20" />
      </LeaderboardFooter>
    </Leaderboard>
  );
}

function LeaderboardContent() {
  const { data: leaderboard } = trpc.getLeaderboard.useQuery({ limit: 3 }, { staleTime: 3600000 });
  const { data: stats } = trpc.getStats.useQuery(undefined, { staleTime: 3600000 });

  if (!leaderboard || !stats) {
    return <LeaderboardSkeleton />;
  }

  return (
    <Leaderboard>
      <LeaderboardHeader />
      {leaderboard.map((entry, index) => (
        <LeaderboardRow key={entry.id}>
          <LeaderboardCell className="w-12">
            <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
              {index + 1}
            </span>
          </LeaderboardCell>
          <LeaderboardCell className="w-16">
            <span className="font-mono text-[12px] font-bold text-[var(--accent-red)]">
              {entry.score.toFixed(1)}
            </span>
          </LeaderboardCell>
          <LeaderboardCell className="flex-1">
            <LeaderboardCodeCell code={entry.code} language={entry.language} />
          </LeaderboardCell>
          <LeaderboardCell className="w-24">
            <span className="font-mono text-[12px] text-[var(--text-secondary)]">
              {entry.language}
            </span>
          </LeaderboardCell>
        </LeaderboardRow>
      ))}
      <LeaderboardFooter>
        <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
          showing top 3 of {stats.totalRoasts.toLocaleString()} ·{" "}
          <Link
            href="/leaderboard"
            className="font-mono text-[12px] text-[var(--text-secondary)] hover:underline"
          >
            view full leaderboard &gt;&gt;
          </Link>
        </span>
      </LeaderboardFooter>
    </Leaderboard>
  );
}

export function LeaderboardPreview() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  );
}
