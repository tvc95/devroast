"use client";

import { trpc } from "@/trpc/client";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-client";
import NumberFlow from "@number-flow/react";

function LeaderboardStats() {
  const { data: stats } = trpc.getStats.useQuery();

  if (!stats) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[var(--text-tertiary)]">
          <span className="inline-block w-12 animate-pulse rounded bg-[var(--text-tertiary)]/20">0000</span> submissions
        </span>
        <span className="font-mono text-xs text-[var(--text-tertiary)]">·</span>
        <span className="font-mono text-xs text-[var(--text-tertiary)]">
          avg score: <span className="inline-block w-8 animate-pulse rounded bg-[var(--text-tertiary)]/20">0.0</span>/10
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-[var(--text-tertiary)]">
        <NumberFlow value={stats.totalRoasts} /> submissions
      </span>
      <span className="font-mono text-xs text-[var(--text-tertiary)]">·</span>
      <span className="font-mono text-xs text-[var(--text-tertiary)]">
        avg score:{" "}
        <NumberFlow
          value={stats.avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg-page)] px-20 py-10">
      <section className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold text-[var(--accent-green)]">
            &gt;
          </span>
          <h1 className="font-mono text-3xl font-bold text-[var(--text-primary)]">
            shame_leaderboard
          </h1>
        </div>

        <p className="font-mono text-sm text-[var(--text-secondary)]">
          // the most roasted code on the internet
        </p>

        <LeaderboardStats />
      </section>

      <section className="mt-10">
        <LeaderboardList />
      </section>
    </main>
  );
}
