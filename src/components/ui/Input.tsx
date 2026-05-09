import * as React from "react";

import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-[var(--ring)]",
        className,
      )}
      {...props}
    />
  );
});
