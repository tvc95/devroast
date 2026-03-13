import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={twMerge(
        "overflow-hidden rounded border border-[var(--border-primary)] bg-[var(--bg-input)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CodeBlockHeaderProps extends HTMLAttributes<HTMLDivElement> {
  fileName?: string;
}

export function CodeBlockHeader({
  fileName,
  className,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex h-10 items-center gap-3 border-b border-[var(--border-primary)] px-4",
        className,
      )}
      {...props}
    >
      <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
      <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
      <div className="flex-1" />
      {fileName && (
        <span className="font-mono text-xs text-[var(--text-tertiary)]">
          {fileName}
        </span>
      )}
    </div>
  );
}

export interface CodeBlockBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function CodeBlockBody({
  children,
  className,
  ...props
}: CodeBlockBodyProps) {
  return (
    <div className={twMerge("flex", className)} {...props}>
      {children}
    </div>
  );
}

export interface CodeBlockLineNumbersProps
  extends HTMLAttributes<HTMLDivElement> {
  lineCount: number;
}

export function CodeBlockLineNumbers({
  lineCount,
  className,
  ...props
}: CodeBlockLineNumbersProps) {
  return (
    <div
      className={twMerge(
        "flex w-12 flex-col items-end border-r border-[var(--border-primary)] bg-[var(--bg-surface)] py-3 pr-2 font-mono text-[12px] leading-6 text-[var(--text-tertiary)]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
        <span key={String(i + 1)}>{i + 1}</span>
      ))}
    </div>
  );
}

export interface CodeBlockContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function CodeBlockContent({
  children,
  className,
  ...props
}: CodeBlockContentProps) {
  return (
    <div
      className={twMerge(
        "flex-1 overflow-x-auto py-3 pl-3 pr-4 font-mono text-[12px] leading-6 text-[var(--text-primary)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
