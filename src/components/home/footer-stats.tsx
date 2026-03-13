import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface FooterStatsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function FooterStats({
  children,
  className,
  ...props
}: FooterStatsProps) {
  return (
    <div
      className={twMerge("flex items-center justify-center gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface FooterStatsItemProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export function FooterStatsItem({
  children,
  className,
  ...props
}: FooterStatsItemProps) {
  return (
    <span
      className={twMerge(
        "font-mono text-[12px] text-[var(--text-tertiary)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface FooterStatsDividerProps
  extends HTMLAttributes<HTMLSpanElement> {}

export function FooterStatsDivider({
  className,
  ...props
}: FooterStatsDividerProps) {
  return (
    <span
      className={twMerge(
        "font-mono text-[12px] text-[var(--text-tertiary)]",
        className,
      )}
      {...props}
    >
      ·
    </span>
  );
}
