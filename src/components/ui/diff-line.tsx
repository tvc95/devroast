import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv(
  {
    base: ["flex gap-2 px-4 py-2 font-mono text-[13px]"],
    variants: {
      type: {
        removed: ["bg-[#1A0A0A]"],
        added: ["bg-[#0A1A0F]"],
        context: [],
      },
    },
    defaultVariants: {
      type: "context",
    },
  },
  {
    twMerge: true,
  },
);

const prefixSymbol = {
  removed: "-",
  added: "+",
  context: " ",
};

const prefixColor = {
  removed: "text-[var(--accent-red)]",
  added: "text-[var(--accent-green)]",
  context: "text-[var(--text-tertiary)]",
};

export interface DiffLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLine> {
  code: string;
}

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, code, ...props }, ref) => {
    return (
      <div ref={ref} className={diffLine({ type, className })} {...props}>
        <span className={type ? prefixColor[type] : prefixColor.context}>
          {type ? prefixSymbol[type] : prefixSymbol.context}
        </span>
        <span
          className={
            type === "removed"
              ? "text-[var(--text-secondary)]"
              : type === "added"
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-secondary)]"
          }
        >
          {code}
        </span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";
