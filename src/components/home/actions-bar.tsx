"use client";

import { type HTMLAttributes, type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export interface ActionsBarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function ActionsBar({ children, className, ...props }: ActionsBarProps) {
  return (
    <div
      className={twMerge(
        "flex w-[780px] items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ActionsBarToggleProps {
  children?: ReactNode;
}

export function ActionsBarToggle({ children }: ActionsBarToggleProps) {
  const [roastMode, setRoastMode] = useState(true);

  return (
    <div className="flex items-center gap-4">
      <Toggle pressed={roastMode} onPressedChange={setRoastMode}>
        {children || "roast mode"}
      </Toggle>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        {`//`} maximum sarcasm enabled
      </span>
    </div>
  );
}

export interface ActionsBarSubmitProps
  extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function ActionsBarSubmit({
  children,
  className,
  ...props
}: ActionsBarSubmitProps) {
  return (
    <Button className={className} {...props}>
      {children || "$ roast_my_code"}
    </Button>
  );
}
