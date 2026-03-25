"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={toggle}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-zinc-800 transition-colors",
        isChecked && "bg-pink-500/80",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          isChecked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
