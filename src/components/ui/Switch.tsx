"use client";

import { cn } from "@/lib/cn";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
};

/*
 * RTL switch: ON (checked) = knob on the physical LEFT (left-0.5).
 * OFF (unchecked) = knob on the physical RIGHT (left-[22px]).
 * Absolute positioning avoids RTL-flex-start issues where translate-x
 * would push the knob outside the container.
 */
export function Switch({ checked, onChange, disabled, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-block h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-gradient-to-l from-[#f4a0ba] to-[#ed85a8]"
          : "bg-[#d8cdd2]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-[left] duration-200",
          checked ? "left-0.5" : "left-[22px]",
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
