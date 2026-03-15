"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

const langMap: Record<string, string> = {
  JavaScript: "javascript",
  Python: "python",
  Bash: "bash",
  Java: "java",
};

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [html, setHtml] = useState<string>("");
  const lang = langMap[language] || "javascript";

  const highlight = (theme: string) => {
    codeToHtml(code, { lang, theme }).then(setHtml);
  };

  useEffect(() => {
    highlight(document.documentElement.classList.contains("dark") ? "vesper" : "github-light");

    const observer = new MutationObserver(() => {
      highlight(document.documentElement.classList.contains("dark") ? "vesper" : "github-light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [code, lang]);

  return (
    <div className="flex">
      <div className="flex w-10 flex-col items-end border-r border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-3">
        {code.split("\n").map((_, i) => (
          <span
            key={i}
            className="font-mono text-xs leading-6 text-[var(--text-tertiary)]"
          >
            {i + 1}
          </span>
        ))}
      </div>
      <div
        className="flex-1 overflow-x-auto px-4 py-3 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!font-mono [&_code]:!text-sm [&_code]:!leading-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
