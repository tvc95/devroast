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

export function LeaderboardCodeCell({ code, language, maxLines = 10 }: CodeCellProps) {
  const [darkHtml, setDarkHtml] = useState("");
  const [lightHtml, setLightHtml] = useState("");
  const lang = langMap[language] || "javascript";
  const lines = code.split("\n");
  const visibleLines = lines.slice(0, maxLines);
  const codeToHighlight = visibleLines.join("\n");

  useEffect(() => {
    Promise.all([
      codeToHtml(codeToHighlight, { lang, theme: "vesper" }),
      codeToHtml(codeToHighlight, { lang, theme: "github-light" }),
    ]).then(([dark, light]) => {
      setDarkHtml(dark);
      setLightHtml(light);
    });
  }, [codeToHighlight, lang]);

  return (
    <div className="flex w-full min-w-0 overflow-hidden rounded bg-[var(--bg-surface)]">
      <div className="flex w-10 flex-shrink-0 flex-col items-end border-r border-[var(--border-primary)] px-2 py-2">
        {visibleLines.map((_, i) => (
          <span
            key={i}
            className="font-mono text-[11px] leading-5 text-[var(--text-tertiary)]"
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
  );
}
