"use client";

import { useState } from "react";
import { CodeInput } from "@/components/home/code-input";

export function CodeInputWrapper({
  onSubmitEnabled,
}: {
  onSubmitEnabled: (enabled: boolean) => void;
}) {
  return <CodeInput onSubmitEnabled={onSubmitEnabled} />;
}
