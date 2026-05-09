"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/constants";
import { logout } from "@/services/auth.service";

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

type SidebarIconName = "home" | "grid" | "box" | "settings";

const navItems: Array<{ label: string; href: string; icon: SidebarIconName }> = [
  { label: "الرئيسية", href: ROUTES.dashboard, icon: "home" },
  { label: "الأقسام", href: ROUTES.categories, icon: "grid" },
  { label: "المنتجات", href: ROUTES.products, icon: "box" },
  { label: "الإعدادات", href: ROUTES.settings, icon: "settings" },
];

const preferredLogos = ["/assets/logo.png", "/assets/logo-removebg-preview.png"] as const;

function NavIcon({ name }: { name: SidebarIconName }) {
  if (name === "home") {
    return (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
        <path d="M2.5 7.5L10 2.5L17.5 7.5V17.5H13.333V12.5H6.667V17.5H2.5V7.5Z" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "grid") {
    return (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.65" />
        <rect x="11" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.65" />
        <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.65" />
        <rect x="11" y="11" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.65" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.65" />
        <line x1="6.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="6.5" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="6.5" y1="14" x2="9" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.65" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" />
      <line x1="10" y1="2.5" x2="10" y2="4.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <line x1="10" y1="15.5" x2="10" y2="17.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <line x1="2.5" y1="10" x2="4.5" y2="10" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <line x1="15.5" y1="10" x2="17.5" y2="10" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [logoIndex, setLogoIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  const logoSrc = useMemo(() => preferredLogos[logoIndex], [logoIndex]);
  const canTryNext = logoIndex < preferredLogos.length - 1;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop — mobile/tablet only */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        aria-label="القائمة الجانبية"
        className={cn(
          // Mobile: fixed drawer from the right
          "fixed right-0 top-0 z-50 flex h-screen w-[272px] max-w-[88vw] flex-col",
          "rounded-bl-[28px] rounded-tl-[28px]",
          "border-y border-l border-[#efc6d4]",
          "bg-gradient-to-b from-[#fff2f6] via-[#fff9fb] to-[#ffeef4]",
          "shadow-[-4px_0_40px_rgba(232,140,170,0.18)]",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
          // Desktop: sticky in-flow panel
          "lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:w-[264px]",
          "lg:translate-x-0 lg:self-start",
          "lg:rounded-[28px] lg:border lg:border-[#efc6d4]",
          "lg:shadow-[0_6px_28px_rgba(232,140,170,0.13)]",
        )}
      >
        {/* Close button — mobile only, absolute so it doesn't affect layout */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق القائمة"
          className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0d0dc] bg-white/90 text-[#9a6070] shadow-sm transition hover:bg-[#fff4f7] lg:hidden"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </button>

        {/* ── Scrollable column ─────────────────────────────────── */}
        {/* overflow-y-auto on this div + min-h-full on the inner div
            gives us: content fills available height on tall screens,
            scrolls gracefully on short screens. */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex min-h-full flex-col px-4 pb-5 pt-5">

            {/* ── Logo ──────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[#f0c5d2] bg-white/85 px-4 py-3.5 shadow-[0_2px_12px_rgba(232,140,170,0.1)]">
              {!showFallback ? (
                <Image
                  src={logoSrc}
                  alt="Aya Sweets"
                  width={200}
                  height={110}
                  className="mx-auto h-auto w-full max-w-[150px] object-contain"
                  onError={() => {
                    if (canTryNext) {
                      setLogoIndex((v) => v + 1);
                    } else {
                      setShowFallback(true);
                    }
                  }}
                />
              ) : (
                <p className="py-2 text-center text-lg font-bold text-[#5a2d3b]">آية حلويات</p>
              )}
            </div>

            {/* ── Navigation ────────────────────────────────────── */}
            <nav className="mt-4 space-y-1" dir="rtl">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex h-11 w-full items-center justify-between rounded-2xl px-3.5 text-[15px] font-semibold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-l from-[#f4a0ba] to-[#ed85a8] text-white shadow-[0_5px_18px_rgba(237,133,168,0.30)]"
                        : "text-[#4a2a36] hover:bg-white/65 hover:shadow-[0_2px_8px_rgba(232,140,170,0.1)]",
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl",
                        isActive ? "bg-white/25 text-white" : "bg-[#fff0f5] text-[#c06080]",
                      )}
                    >
                      <NavIcon name={item.icon} />
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Flexible spacer ───────────────────────────────── */}
            <div className="flex-1" />

            {/* ── Bottom section ────────────────────────────────── */}
            <div className="mt-5 space-y-3">

              {/* Illustration card — visually matches logo card */}
              <div className="rounded-2xl border border-[#f0c5d2] bg-white/85 px-3 pb-3 pt-3 shadow-[0_2px_12px_rgba(232,140,170,0.1)]">
                <Image
                  src="/assets/image_prand.png"
                  alt="آية حلويات"
                  width={220}
                  height={96}
                  className="mx-auto h-auto max-h-[90px] w-full object-contain"
                />
                <p className="mt-2 text-center text-[11px] font-semibold tracking-wide text-[#c06080]">
                  كل قطعة تصنع بحب
                </p>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={logout}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-[#efc6d4] bg-white/70 text-[13px] font-semibold text-[#5c3340] transition hover:bg-white hover:shadow-[0_2px_10px_rgba(232,140,170,0.15)]"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M12 6L15 9L12 12M15 9H7M9 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5" stroke="#c05570" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>تسجيل خروج</span>
              </button>
            </div>

          </div>
        </div>
      </aside>
    </>
  );
}
