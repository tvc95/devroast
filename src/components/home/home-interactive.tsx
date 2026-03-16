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
    </>
  );
}
