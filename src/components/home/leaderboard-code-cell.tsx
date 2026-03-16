"use client";

import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";

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
  const [darkHtml, setDarkHtml] = useState("");
  const [lightHtml, setLightHtml] = useState("");
  const lang = langMap[language] || "javascript";
  const lines = code.split("\n");
  const hasMoreLines = lines.length > maxLines;

  const codeToHighlight = isOpen ? code : lines.slice(0, maxLines).join("\n");

  useEffect(() => {
    Promise.all([
      codeToHtml(codeToHighlight, { lang, theme: "vesper" }),
      codeToHtml(codeToHighlight, { lang, theme: "github-light" }),
    ]).then(([dark, light]) => {
      setDarkHtml(dark);
      setLightHtml(light);
    });
  }, [codeToHighlight, lang]);

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

        <div className="relative flex-1 overflow-x-auto px-3 py-2">
          <div className="dark:[&_pre]:!bg-transparent dark:[&_pre]:!p-0 dark:[&_code]:!font-mono dark:[&_code]:!text-[11px] dark:[&_code]:!leading-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible whitespace-pre font-mono text-[11px] leading-5 opacity-0 dark:opacity-100 transition-opacity"
              dangerouslySetInnerHTML={{ __html: darkHtml }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible whitespace-pre font-mono text-[11px] leading-5 opacity-100 dark:opacity-0 transition-opacity"
              dangerouslySetInnerHTML={{ __html: lightHtml }}
            />
          </div>
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
