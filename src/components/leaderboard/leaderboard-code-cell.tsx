"use client";

import { useEffect, useRef, useState } from "react";
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

export function LeaderboardCodeCell({
  code,
  language,
  maxLines = 10,
}: CodeCellProps) {
  const [html, setHtml] = useState("");
  const lang = langMap[language] || "javascript";

  // Memoize o código visível como string estável
  const visibleCode = code.split("\n").slice(0, maxLines).join("\n");
  const visibleLines = visibleCode.split("\n");

  // Ref para cancelar highlight desatualizado
  const abortRef = useRef(false);

  const highlight = async (code: string, theme: string) => {
    abortRef.current = true; // cancela qualquer highlight anterior em voo
    const cancelled = abortRef.current;
    abortRef.current = false;

    const result = await codeToHtml(code, { lang, theme });

    // Só atualiza se este highlight ainda é o mais recente
    if (!cancelled) {
      setHtml(result);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const getTheme = () =>
      document.documentElement.classList.contains("dark")
        ? "vesper"
        : "github-light";

    const run = async (theme: string) => {
      const result = await codeToHtml(visibleCode, { lang, theme });
      if (!cancelled) setHtml(result); // ← nunca limpa antes de ter o resultado
    };

    run(getTheme());

    const observer = new MutationObserver(() => {
      run(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true; // evita setHtml de promises antigas
      observer.disconnect();
    };
  }, [visibleCode, lang]); // ← string estável, sem loop

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
            {visibleCode}
          </pre>
        )}
      </div>
    </div>
  );
}
