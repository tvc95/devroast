"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";
import { CodeBlock } from "@/app/leaderboard/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { parseDiff, type DiffLine } from "@/lib/diff";

function IssueCard({
  issue,
}: {
  issue: { severity: string; title: string; description: string };
}) {
  const typeStyles = {
    critical: {
      dot: "bg-[var(--accent-red)]",
      title: "text-[var(--accent-red)]",
      border: "border-[var(--border-primary)]",
    },
    warning: {
      dot: "bg-[var(--accent-amber)]",
      title: "text-[var(--accent-amber)]",
      border: "border-[var(--border-primary)]",
    },
    good: {
      dot: "bg-[var(--accent-green)]",
      title: "text-[var(--text-primary)]",
      border: "border-[var(--border-primary)]",
    },
  };

  const style = typeStyles[issue.severity as keyof typeof typeStyles] || typeStyles.warning;

  return (
    <div className={`flex flex-col gap-3 rounded-sm border bg-[var(--bg-surface)] p-5 ${style.border}`}>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${style.dot}`} />
        <span className={`font-mono text-[13px] font-medium ${style.title}`}>
          {issue.title}
        </span>
      </div>
      <p className="font-mono text-[12px] leading-[1.5] text-[var(--text-secondary)]">
        {issue.description}
      </p>
    </div>
  );
}

function DiffBlock({
  suggestedFix,
  language,
}: {
  suggestedFix: string;
  language: string;
}) {
  const parsedDiff = parseDiff(suggestedFix);

  if (parsedDiff.length === 0) {
    return (
      <div className="flex flex-col rounded-sm border border-[var(--border-primary)] bg-[var(--bg-input)] p-5">
        <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
          No suggested fixes available
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-sm border border-[var(--border-primary)] bg-[var(--bg-input)]">
      <div className="flex h-10 items-center border-b border-[var(--border-primary)] px-4">
        <span className="font-mono text-[12px] font-medium text-[var(--text-secondary)]">
          suggested_fix.{language || "ts"}
        </span>
      </div>
      <div className="flex flex-col">
        {parsedDiff.map((line: DiffLine, index) => {
          switch (line.type) {
            case "context":
              return (
                <div key={index} className="flex font-mono text-[12px]">
                  <span className="w-5 flex-shrink-0 px-4 py-0.5 text-[var(--text-tertiary)]" />
                  <span className="flex-1 px-4 py-0.5 text-[var(--text-primary)]">
                    {line.content}
                  </span>
                </div>
              );
            case "removed":
              return (
                <div
                  key={index}
                  className="flex font-mono text-[12px]"
                  style={{ backgroundColor: "rgba(239, 68, 68, 0.08)" }}
                >
                  <span className="w-5 flex-shrink-0 px-4 py-0.5 text-[var(--accent-red)]">- </span>
                  <span className="flex-1 px-4 py-0.5 text-[var(--accent-red)]">
                    {line.content}
                  </span>
                </div>
              );
            case "added":
              return (
                <div
                  key={index}
                  className="flex font-mono text-[12px]"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.08)" }}
                >
                  <span className="w-5 flex-shrink-0 px-4 py-0.5 text-[var(--accent-green)]">+ </span>
                  <span className="flex-1 px-4 py-0.5 text-[var(--accent-green)]">
                    {line.content}
                  </span>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-primary)] border-t-[var(--accent-red)]" />
        <span className="font-mono text-[14px] text-[var(--text-secondary)]">
          loading roast...
        </span>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-mono text-[24px] font-bold text-[var(--text-primary)]">
          roast not found
        </h1>
        <p className="font-mono text-[14px] text-[var(--text-secondary)]">
          this roast doesn&apos;t exist or has been deleted
        </p>
        <Link
          href="/"
          className="mt-4 rounded-sm border border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-2 font-mono text-[12px] text-[var(--text-primary)] hover:bg-[var(--bg-input)]"
        >
          $ go_home
        </Link>
      </div>
    </main>
  );
}

export function RoastResultClient({ id }: { id: string }) {
  const { data: roast, isLoading } = trpc.getRoastById.useQuery({ id });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!roast) {
    return <NotFound />;
  }

  const verdictColor =
    roast.verdict === "needs_serious_help"
      ? "text-[var(--accent-red)]"
      : roast.verdict === "rough_around_edges"
        ? "text-[var(--accent-amber)]"
        : "text-[var(--accent-green)]";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      <div className="flex flex-col gap-10 px-20 py-10">
        {/* Score Hero */}
        <div className="flex flex-col items-center gap-12 sm:flex-row sm:justify-center sm:gap-12">
          <ScoreRing score={roast.score} size="lg" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--accent-red)]" />
              <span className={`font-mono text-[13px] font-medium ${verdictColor}`}>
                verdict: {roast.verdict}
              </span>
            </div>

            <p className="font-mono text-[20px] leading-relaxed text-[var(--text-primary)]">
              &quot;{roast.roastQuote}&quot;
            </p>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                lang: {roast.language}
              </span>
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                ·
              </span>
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                {roast.lineCount} lines
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[var(--border-primary)]" />

        {/* Submitted Code */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[var(--accent-green)]">
              //
            </span>
            <span className="font-mono text-[14px] font-bold text-[var(--text-primary)]">
              your_submission
            </span>
          </div>

          <div className="min-h-[200px] max-h-[424px] overflow-auto rounded-sm border border-[var(--border-primary)] bg-[var(--bg-input)]">
            <CodeBlock code={roast.code} language={roast.language} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[var(--border-primary)]" />

        {/* Detailed Analysis */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[var(--accent-green)]">
              //
            </span>
            <span className="font-mono text-[14px] font-bold text-[var(--text-primary)]">
              detailed_analysis
            </span>
          </div>

          {roast.analysisItems && roast.analysisItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-5">
              {roast.analysisItems.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <p className="font-mono text-[14px] text-[var(--text-tertiary)]">
              no issues found
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[var(--border-primary)]" />

        {/* Suggested Fix */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[var(--accent-green)]">
              //
            </span>
            <span className="font-mono text-[14px] font-bold text-[var(--text-primary)]">
              suggested_fix
            </span>
          </div>

          <DiffBlock suggestedFix={roast.suggestedFix || ""} language={roast.language} />
        </div>
      </div>
    </main>
  );
}
