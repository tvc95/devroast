"use client";

import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const toggle = tv(
  {
    base: [
      "inline-flex items-center gap-3 font-mono text-[12px]",
      "transition-colors duration-200",
      "cursor-pointer",
    ],
    variants: {
      variant: {
        default: [],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
  {
    twMerge: true,
  },
);

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggle> {
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export function Toggle({
  className,
  variant,
  defaultPressed = false,
  pressed: controlledPressed,
  onPressedChange,
  children,
  onClick,
  ...props
}: ToggleProps) {
  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = controlledPressed !== undefined;
  const isPressed = isControlled ? controlledPressed : internalPressed;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newValue = !isPressed;
    if (!isControlled) {
      setInternalPressed(newValue);
    }
    onPressedChange?.(newValue);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      className={toggle({ variant, className })}
      onClick={handleClick}
      aria-pressed={isPressed}
      {...props}
    >
      <ToggleTrack pressed={isPressed}>
        <ToggleKnob pressed={isPressed} />
      </ToggleTrack>
      <ToggleLabel pressed={isPressed}>{children}</ToggleLabel>
    </button>
  );
}

function ToggleTrack({
  pressed,
  children,
}: {
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "flex h-[22px] w-10 items-center rounded-full p-[3px] transition-colors duration-200",
        pressed ? "bg-[var(--accent-green)]" : "bg-[var(--border-primary)]",
      )}
    >
      {children}
    </div>
  );
}

function ToggleKnob({ pressed }: { pressed?: boolean }) {
  return (
    <div
      className={twMerge(
        "h-4 w-4 rounded-full transition-transform duration-200 ease-in-out",
        pressed ? "translate-x-[18px]" : "translate-x-0",
        pressed ? "bg-black" : "bg-[#6B7280]",
      )}
    />
  );
}

function ToggleLabel({
  pressed,
  children,
}: {
  pressed?: boolean;
  children?: ReactNode;
}) {
  if (!children) return null;
  return (
    <span
      className={twMerge(
        "transition-colors duration-200",
        pressed ? "text-[var(--accent-green)]" : "text-[var(--text-secondary)]",
      )}
    >
      {children}
    </span>
  );
}
