"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ActionsBar,
  ActionsBarSubmit,
  ActionsBarToggle,
} from "@/components/home/actions-bar";
import { CodeInput } from "@/components/home/code-input";
import { trpc } from "@/trpc/client";

export function HomeInteractive() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [detectedLanguage, setDetectedLanguage] = useState("auto");
  const [roastMode, setRoastMode] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const router = useRouter();

  const createRoast = trpc.createRoast.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.id}`);
    },
  });

  const handleSubmit = () => {
    if (!code.trim() || !submitEnabled) return;

    const finalLanguage = language === "auto" ? detectedLanguage : language;

    createRoast.mutate({
      code,
      language: finalLanguage,
      roastMode,
    });
  };

  return (
    <>
      <CodeInput
        onSubmitEnabled={setSubmitEnabled}
        onChange={setCode}
        language={language}
        onLanguageChange={setLanguage}
        onDetectedLanguageChange={setDetectedLanguage}
      />
      <ActionsBar>
        <ActionsBarToggle pressed={roastMode} onPressedChange={setRoastMode}>
          roast mode
        </ActionsBarToggle>
        <ActionsBarSubmit
          disabled={!submitEnabled || createRoast.isPending}
          onClick={handleSubmit}
        >
          {createRoast.isPending ? "$ roasting..." : "$ roast_my_code"}
        </ActionsBarSubmit>
      </ActionsBar>

      {createRoast.isError && (
        <div className="flex w-[780px] items-center justify-between rounded border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent-red)]" />
            <span className="font-mono text-[12px] text-[var(--accent-red)]">
              // roast failed — {createRoast.error?.message ?? "unexpected error, try again"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => createRoast.reset()}
            className="ml-4 font-mono text-[11px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-red)]"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
