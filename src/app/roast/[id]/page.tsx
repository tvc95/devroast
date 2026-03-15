import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/app/leaderboard/code-block";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata: Metadata = {
  title: "Roast Result | DevRoast",
  description: "Your code roast result",
};

const roastResult = {
  score: 3.5,
  verdict: "needs_serious_help",
  quote: "this code looks like it was written during a power outage... in 2005.",
  language: "javascript",
  lineCount: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`,
  issues: [
    {
      type: "critical",
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      type: "warning",
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      type: "good",
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      type: "good",
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
  ],
  suggestedFix: {
    fileName: "improved_code.ts",
    diff: [
      { type: "context", content: "function calculateTotal(items) {" },
      {
        type: "removed",
        content: "  var total = 0;",
      },
      {
        type: "removed",
        content: "  for (var i = 0; i < items.length; i++) {",
      },
      {
        type: "removed",
        content: "    total = total + items[i].price;",
      },
      {
        type: "removed",
        content: "  }",
      },
      {
        type: "removed",
        content: "  return total;",
      },
      {
        type: "added",
        content:
          "  return items.reduce((sum, item) => sum + item.price, 0);",
      },
      { type: "context", content: "}" },
    ],
  },
};

function IssueCard({
  issue,
}: {
  issue: (typeof roastResult.issues)[0];
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

  const style = typeStyles[issue.type as keyof typeof typeStyles];

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
}: {
  suggestedFix: (typeof roastResult)["suggestedFix"];
}) {
  return (
    <div className="flex flex-col rounded-sm border border-[var(--border-primary)] bg-[var(--bg-input)]">
      <div className="flex h-10 items-center border-b border-[var(--border-primary)] px-4">
        <span className="font-mono text-[12px] font-medium text-[var(--text-secondary)]">
          {suggestedFix.fileName}
        </span>
      </div>
      <div className="flex flex-col">
        {suggestedFix.diff.map((line, index) => {
          if (line.type === "context") {
            return (
              <div
                key={index}
                className="flex font-mono text-[12px]"
              >
                <span className="w-5 flex-shrink-0 px-4 py-0.5 text-[var(--text-tertiary)]" />
                <span className="flex-1 px-4 py-0.5 text-[var(--text-primary)]">
                  {line.content}
                </span>
              </div>
            );
          }
          if (line.type === "removed") {
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
          }
          if (line.type === "added") {
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
          return null;
        })}
      </div>
    </div>
  );
}

export default function RoastResultPage() {
  const verdictColor =
    roastResult.verdict === "needs_serious_help"
      ? "text-[var(--accent-red)]"
      : roastResult.verdict === "rough_around_edges"
        ? "text-[var(--accent-amber)]"
        : "text-[var(--accent-green)]";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      <div className="flex flex-col gap-10 px-20 py-10">
        {/* Score Hero */}
        <div className="flex flex-col items-center gap-12 sm:flex-row sm:justify-center sm:gap-12">
          <ScoreRing score={roastResult.score} size="lg" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--accent-red)]" />
              <span className={`font-mono text-[13px] font-medium ${verdictColor}`}>
                verdict: {roastResult.verdict}
              </span>
            </div>

            <p className="font-mono text-[20px] leading-relaxed text-[var(--text-primary)]">
              &quot;{roastResult.quote}&quot;
            </p>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                lang: {roastResult.language}
              </span>
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                ·
              </span>
              <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
                {roastResult.lineCount} lines
              </span>
            </div>
            <div>
              <button className="flex items-center gap-1.5 rounded-sm border border-[var(--border-primary)] px-4 py-2">
                <span className="font-mono text-[12px] text-[var(--text-primary)]">
                  $ share_roast
                </span>
              </button>
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
            <CodeBlock
              code={roastResult.code}
              language={roastResult.language}
            />
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

          <div className="grid grid-cols-2 gap-5">
            {roastResult.issues.map((issue, index) => (
              <IssueCard key={index} issue={issue} />
            ))}
          </div>
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

          <DiffBlock suggestedFix={roastResult.suggestedFix} />
        </div>
      </div>
    </main>
  );
}
