import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const scoreRing = tv(
  {
    base: ["relative flex items-center justify-center"],
    variants: {
      size: {
        sm: ["h-24 w-24"],
        md: ["h-[180px] w-[180px]"],
        lg: ["h-64 w-64"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
  {
    twMerge: true,
  },
);

export interface ScoreRingProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreRing> {
  score: number;
  maxScore?: number;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, size, score, maxScore = 10, ...props }, ref) => {
    return (
      <div ref={ref} className={scoreRing({ size, className })} {...props}>
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 180 180"
          role="img"
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          <circle
            cx="90"
            cy="90"
            r="86"
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth="4"
          />
          <circle
            cx="90"
            cy="90"
            r="86"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${(score / maxScore) * 540.4} 540.4`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-green)" />
              <stop offset="100%" stopColor="var(--accent-amber)" />
            </linearGradient>
          </defs>
        </svg>
        <ScoreCenter score={score} maxScore={maxScore} />
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";

function ScoreCenter({ score, maxScore }: { score: number; maxScore: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="font-mono text-[48px] font-bold leading-none text-[var(--text-primary)]">
        {score.toFixed(1)}
      </span>
      <span className="font-mono text-base font-normal leading-none text-[var(--text-tertiary)]">
        /{maxScore}
      </span>
    </div>
  );
}
