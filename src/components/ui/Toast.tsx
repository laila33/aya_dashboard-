"use client";

import { useEffect, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  return { message, showToast: setMessage };
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-[#f0d0dc] bg-white px-5 py-3 shadow-[0_8px_30px_rgba(232,152,178,0.25)]"
      role="alert"
      aria-live="polite"
      dir="rtl"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6.5" stroke="#4caf7d" strokeWidth="1.2" />
          <path d="M4 7l2 2 4-4" stroke="#4caf7d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-[#2d1820]">{message}</p>
    </div>
  );
}
