"use client";

import type { HTMLAttributes, ReactNode } from "react";
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
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export function ActionsBarToggle({
  children,
  pressed = true,
  onPressedChange,
}: ActionsBarToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <Toggle pressed={pressed} onPressedChange={onPressedChange}>
        {children || "roast mode"}
      </Toggle>
      <span className="font-mono text-[12px] text-[var(--text-tertiary)]">
        {pressed
          ? "// maximum sarcasm enabled"
          : "// constructive feedback mode"}
      </span>
    </div>
  );
}

export interface ActionsBarSubmitProps
  extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  disabled?: boolean;
}

export function ActionsBarSubmit({
  children,
  className,
  disabled,
  ...props
}: ActionsBarSubmitProps) {
  return (
    <Button className={className} disabled={disabled} {...props}>
      {children || "$ roast_my_code"}
    </Button>
  );
}
