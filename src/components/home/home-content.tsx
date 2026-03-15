"use client";

import { useState, Suspense } from "react";
import {
  ActionsBar,
  ActionsBarSubmit,
  ActionsBarToggle,
} from "@/components/home/actions-bar";
import { CodeInput } from "@/components/home/code-input";
import { FooterStats, FooterStatsItem } from "@/components/home/footer-stats";
import { FooterStatsContent } from "@/components/home/footer-stats-content";
import {
  Leaderboard,
  LeaderboardCell,
  LeaderboardFooter,
  LeaderboardFooterLink,
  LeaderboardHeader,
  LeaderboardRow,
} from "@/components/home/leaderboard-preview";

const leaderboardData = [
  {
    rank: 1,
    score: 1.2,
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    lang: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    lang: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    lang: "sql",
  },
];

function FooterStatsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-6">
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        <span className="inline-block w-12 animate-pulse rounded bg-[var(--text-tertiary)]/20">0000</span>{" "}
        codes roasted
      </span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">·</span>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        avg score: <span className="inline-block w-8 animate-pulse rounded bg-[var(--text-tertiary)]/20">0.0</span>/10
      </span>
    </div>
  );
}

function FooterStatsWrapper() {
  return (
    <Suspense fallback={<FooterStatsSkeleton />}>
      <FooterStatsContent />
    </Suspense>
  );
}

export function HomeContent() {
  const [submitEnabled, setSubmitEnabled] = useState(true);

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center bg-[var(--bg-page)] px-10 pt-8">
      <div className="flex w-full max-w-[960px] flex-col items-center gap-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="flex items-center gap-3 font-mono text-[36px] font-bold text-[var(--text-primary)]">
            <span className="text-[var(--accent-green)]">$</span>
            paste your code. get roasted.
          </h1>
          <p className="font-mono text-[14px] text-[var(--text-secondary)]">
            {`//`} drop your code below and we&apos;ll rate it — brutally honest
            or full roast mode
          </p>
        </div>

        {/* Code Input */}
        <CodeInput onSubmitEnabled={setSubmitEnabled} />

        {/* Actions Bar */}
        <ActionsBar>
          <ActionsBarToggle>roast mode</ActionsBarToggle>
          <ActionsBarSubmit disabled={!submitEnabled}>
            $ roast_my_code
          </ActionsBarSubmit>
        </ActionsBar>

        {/* Footer Stats */}
        <FooterStats>
          <FooterStatsWrapper />
        </FooterStats>

        {/* Spacer */}
        <div className="h-10" />

        {/* Leaderboard Preview */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-mono text-[14px] font-bold text-[var(--text-primary)]">
              <span className="text-[var(--accent-green)]">{`//`}</span>
              shame_leaderboard
            </h2>
            <span className="font-mono text-[12px] text-[var(--text-secondary)]">
              $ view_all &gt;&gt;
            </span>
          </div>
          <p className="font-mono text-[13px] text-[var(--text-tertiary)]">
            {`//`} the worst code on the internet, ranked by shame
          </p>
          <Leaderboard>
            <LeaderboardHeader />
            {leaderboardData.map((entry) => (
              <LeaderboardRow key={entry.rank}>
                <LeaderboardCell className="w-12">
                  <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                    {entry.rank}
                  </span>
                </LeaderboardCell>
                <LeaderboardCell className="w-16">
                  <span className="font-mono text-[12px] font-bold text-[var(--accent-red)]">
                    {entry.score.toFixed(1)}
                  </span>
                </LeaderboardCell>
                <LeaderboardCell className="flex-1">
                  <div className="flex flex-col gap-0.5">
                    {entry.code.map((line) => (
                      <span
                        key={line}
                        className="font-mono text-[12px] text-[var(--text-primary)]"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </LeaderboardCell>
                <LeaderboardCell className="w-24">
                  <span className="font-mono text-[12px] text-[var(--text-secondary)]">
                    {entry.lang}
                  </span>
                </LeaderboardCell>
              </LeaderboardRow>
            ))}
            <LeaderboardFooter>
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                showing top 3 of 2,847 · <LeaderboardFooterLink />
              </span>
            </LeaderboardFooter>
          </Leaderboard>
        </div>

        {/* Bottom Spacer */}
        <div className="h-10" />
      </div>
    </main>
  );
}
