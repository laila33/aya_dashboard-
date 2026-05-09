import * as React from "react";

import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, title, onClose, children, className }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" role="dialog" aria-modal="true">
      <div className={cn("w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]", className)}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
