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
  const [html, setHtml] = useState("");
  const lang = langMap[language] || "javascript";
  const lines = code.split("\n");
  const visibleLines = lines.slice(0, maxLines);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const theme = isDark ? "vesper" : "github-light";
    
    const codeToHighlight = visibleLines.join("\n");
    
    codeToHtml(codeToHighlight, { lang, theme }).then(setHtml);

    const observer = new MutationObserver(() => {
      const updatedIsDark = document.documentElement.classList.contains("dark");
      const updatedTheme = updatedIsDark ? "vesper" : "github-light";
      codeToHtml(codeToHighlight, { lang, theme: updatedTheme }).then(setHtml);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [code, lang, visibleLines]);

  return (
    <div className="flex w-full min-w-0 overflow-hidden rounded bg-[var(--bg-surface)]">
      <div className="flex w-10 flex-shrink-0 flex-col items-end border-r border-[var(--border-primary)] px-2 py-2">
        {visibleLines.map((_, i) => (
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
          <pre className="font-mono text-[11px] leading-5 text-[var(--text-primary)] whitespace-pre-wrap">
            {visibleLines.join("\n")}
          </pre>
        )}
      </div>
    </div>
  );
}
