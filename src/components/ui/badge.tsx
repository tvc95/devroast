import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv(
  {
    base: ["inline-flex items-center gap-2 font-mono text-[12px]"],
    variants: {
      variant: {
        critical: ["text-[var(--accent-red)]"],
        warning: ["text-[var(--accent-amber)]"],
        good: ["text-[var(--accent-green)]"],
      },
    },
    defaultVariants: {
      variant: "good",
    },
  },
  {
    twMerge: true,
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badge> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={badge({ variant, className })} {...props}>
        <BadgeDot variant={variant} />
        {children}
      </div>
    );
  },
);

function BadgeDot({ variant }: { variant?: "critical" | "warning" | "good" }) {
  const colorMap = {
    critical: "bg-[var(--accent-red)]",
    warning: "bg-[var(--accent-amber)]",
    good: "bg-[var(--accent-green)]",
  };

  return (
    <div
      className={twMerge(
        "h-2 w-2 rounded-full",
        variant ? colorMap[variant] : colorMap.good,
      )}
    />
  );
}

Badge.displayName = "Badge";
