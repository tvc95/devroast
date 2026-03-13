import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv(
  {
    base: [
      "inline-flex items-center justify-center gap-2 font-mono text-[13px] font-medium",
      "transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
    ],
    variants: {
      variant: {
        default: ["bg-emerald-500 text-black enabled:hover:bg-emerald-600"],
        secondary: [
          "bg-zinc-200 text-black enabled:hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:enabled:hover:bg-zinc-700",
        ],
        outline: [
          "border border-input bg-transparent enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        ],
        ghost: ["enabled:hover:bg-accent enabled:hover:text-accent-foreground"],
        destructive: ["bg-red-500 text-white enabled:hover:bg-red-600"],
        link: ["text-primary underline-offset-4 enabled:hover:underline"],
      },
      size: {
        sm: ["h-8 px-3 text-xs"],
        md: ["h-10 px-6"],
        lg: ["h-12 px-8 text-base"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
  {
    twMerge: true,
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={button({ variant, size, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
