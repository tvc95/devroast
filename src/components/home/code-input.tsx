"use client";

import { type HTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface CodeInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

export function CodeInput({
  value: controlledValue,
  onChange,
  className,
  ...props
}: CodeInputProps) {
  const [internalValue, setInternalValue] = useState(sampleCode);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const lines = currentValue.split("\n");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div
      className={twMerge(
        "overflow-hidden rounded border border-[var(--border-primary)] bg-[var(--bg-input)]",
        className,
      )}
      {...props}
    >
      <CodeHeader />
      <div className="flex h-[360px] w-[780px]">
        <LineNumbers lineCount={lines.length} />
        <CodeTextarea value={currentValue} onChange={handleChange} />
      </div>
    </div>
  );
}

function CodeHeader() {
  return (
    <div className="flex h-10 items-center gap-3 border-b border-[var(--border-primary)] px-4">
      <div className="h-3 w-3 rounded-full bg-red-500" />
      <div className="h-3 w-3 rounded-full bg-amber-500" />
      <div className="h-3 w-3 rounded-full bg-emerald-500" />
    </div>
  );
}

function LineNumbers({ lineCount }: { lineCount: number }) {
  return (
    <div className="flex w-12 flex-col items-end border-r border-[var(--border-primary)] bg-[var(--bg-surface)] py-3 pr-2 font-mono text-[12px] leading-6 text-[var(--text-tertiary)]">
      {Array.from({ length: Math.max(lineCount, 16) }, (_, i) => (
        <span key={String(i + 1)}>{i + 1}</span>
      ))}
    </div>
  );
}

function CodeTextarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className="flex-1 resize-none bg-transparent py-3 pl-3 pr-4 font-mono text-[12px] leading-6 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
      placeholder="// paste your code here..."
      spellCheck={false}
    />
  );
}
