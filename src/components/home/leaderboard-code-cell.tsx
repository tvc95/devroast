"use client";

import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "@/components/theme-provider";

interface CodeCellProps {
  code: string;
  language: string;
  maxLines?: number;
}

const langMap: Record<string, string> = {
  JavaScript: "javascript",
  javascript: "javascript",
  Python: "python",
  Bash: "bash",
  Java: "java",
  TypeScript: "typescript",
  SQL: "sql",
  Go: "go",
  Rust: "rust",
};

function ChevronIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
    >
      <path
        d="M3.5 9L7.5 5L3.5 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeaderboardCodeCell({ code, language, maxLines = 3 }: CodeCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [html, setHtml] = useState("");
  const { theme } = useTheme();
  const lang = langMap[language] || "javascript";
  const lines = code.split("\n");
  const hasMoreLines = lines.length > maxLines;

  useEffect(() => {
    const shikiTheme = theme === "dark" ? "vesper" : "github-light";
    
    const codeToHighlight = isOpen ? code : lines.slice(0, maxLines).join("\n");
    
    codeToHtml(codeToHighlight, { lang, theme: shikiTheme }).then(setHtml);
  }, [code, lang, isOpen, maxLines, lines, theme]);

  const hiddenLines = lines.length - maxLines;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex w-full min-w-0 overflow-hidden rounded bg-[var(--bg-surface)]">
        <div className="flex w-10 flex-shrink-0 flex-col items-end border-r border-[var(--border-primary)] px-2 py-2">
          {lines.slice(0, isOpen ? lines.length : maxLines).map((_, i) => (
            <span
              key={i}
              className="font-mono text-[11px] leading-6 text-[var(--text-tertiary)]"
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto px-3 py-2">
          {html ? (
            <div
              className="[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!font-mono [&_code]:!text-[11px] [&_code]:!leading-5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="font-mono text-[11px] text-[var(--text-primary)] whitespace-pre-wrap">
              {isOpen ? code : lines.slice(0, maxLines).join("\n")}
            </pre>
          )}
        </div>
      </div>

      {hasMoreLines && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-1 self-start rounded px-2 py-1 font-mono text-[11px] text-[var(--text-tertiary)] hover:bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]"
        >
          <span className={`transition-transform duration-200 ease-out ${isOpen ? "rotate-90" : ""}`}>
            <ChevronIcon />
          </span>
          {isOpen ? "show less" : `show ${hiddenLines} more line${hiddenLines > 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}
