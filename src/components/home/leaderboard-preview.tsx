import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface LeaderboardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function Leaderboard({
  children,
  className,
  ...props
}: LeaderboardProps) {
  return (
    <div
      className={twMerge(
        "flex w-full flex-col rounded border border-[var(--border-primary)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface LeaderboardHeaderProps
  extends HTMLAttributes<HTMLDivElement> {}

export function LeaderboardHeader({
  className,
  ...props
}: LeaderboardHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex h-10 w-full items-center border-b border-[var(--border-primary)] bg-[var(--bg-surface)] px-5",
        className,
      )}
      {...props}
    >
      <div className="w-12 font-mono text-[12px] font-medium text-[var(--text-tertiary)]">
        rank
      </div>
      <div className="w-16 font-mono text-[12px] font-medium text-[var(--text-tertiary)]">
        score
      </div>
      <div className="flex-1 font-mono text-[12px] font-medium text-[var(--text-tertiary)]">
        code
      </div>
      <div className="w-24 font-mono text-[12px] font-medium text-[var(--text-tertiary)]">
        lang
      </div>
    </div>
  );
}

export interface LeaderboardRowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function LeaderboardRow({
  children,
  className,
  ...props
}: LeaderboardRowProps) {
  return (
    <div
      className={twMerge(
        "flex w-full items-center border-b border-[var(--border-primary)] px-5 py-4 last:border-b-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface LeaderboardCellProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function LeaderboardCell({
  children,
  className,
  ...props
}: LeaderboardCellProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export interface LeaderboardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function LeaderboardFooter({
  children,
  className,
  ...props
}: LeaderboardFooterProps) {
  return (
    <div
      className={twMerge("flex justify-center px-4 py-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface LeaderboardFooterLinkProps
  extends HTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

export function LeaderboardFooterLink({
  children,
  className,
  ...props
}: LeaderboardFooterLinkProps) {
  return (
    <Link
      href="/leaderboard"
      className={twMerge(
        "font-mono text-[12px] text-[var(--text-secondary)] hover:underline",
        className,
      )}
      {...props}
    >
      {children || "view full leaderboard >>"}
    </Link>
  );
}
