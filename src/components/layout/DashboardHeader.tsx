type SidebarIconName = "home" | "grid" | "box" | "eye" | "settings";

type DashboardHeaderProps = {
  isHome: boolean;
  pageTitle: string;
  pageSubtitle: string;
  pageIcon?: SidebarIconName;
  onMenuClick: () => void;
};

function PageIcon({ name }: { name: SidebarIconName }) {
  if (name === "grid") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
        <rect x="12.5" y="2.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
        <rect x="2.5" y="12.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
        <rect x="12.5" y="12.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="#e5789d" strokeWidth="1.6" />
        <line x1="7" y1="9" x2="15" y2="9" stroke="#e5789d" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7" y1="13" x2="12" y2="13" stroke="#e5789d" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "settings") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8" stroke="#e5789d" strokeWidth="1.6" />
        <circle cx="11" cy="11" r="3" stroke="#e5789d" strokeWidth="1.4" />
        <line x1="11" y1="3" x2="11" y2="5" stroke="#e5789d" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="11" y1="17" x2="11" y2="19" stroke="#e5789d" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="3" y1="11" x2="5" y2="11" stroke="#e5789d" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="17" y1="11" x2="19" y2="11" stroke="#e5789d" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "eye") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M2 11C2 11 5.5 5 11 5C16.5 5 20 11 20 11C20 11 16.5 17 11 17C5.5 17 2 11 2 11Z" stroke="#e5789d" strokeWidth="1.6" />
        <circle cx="11" cy="11" r="2.5" stroke="#e5789d" strokeWidth="1.4" />
      </svg>
    );
  }
  return null;
}

export function DashboardHeader({
  isHome,
  pageTitle,
  pageSubtitle,
  pageIcon,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[22px] border border-[#efc8d5] bg-gradient-to-l from-white to-[#fff9fb] px-5 py-4 shadow-[0_2px_16px_rgba(232,152,178,0.1)] sm:px-6 sm:py-5">

      {/* Subtle decorative hearts */}
      <span aria-hidden="true" className="pointer-events-none absolute right-[38%] top-3 select-none text-[20px] leading-none text-[#f5c8d4] opacity-55">♡</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-[52%] bottom-2 select-none text-[13px] leading-none text-[#f5c8d4] opacity-35">♡</span>
      <span aria-hidden="true" className="pointer-events-none absolute left-[26%] top-4 select-none text-[10px] leading-none text-[#f5c8d4] opacity-30">♡</span>

      {/* ── Row: title (right) + actions (left) ───────────────── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        {/* Title area */}
        <div className="min-w-0 flex-1 text-right">
          {isHome ? (
            <>
              <h1 className="text-2xl font-bold leading-tight text-[#2f171f] sm:text-3xl">
                {pageTitle}
              </h1>
              <p className="mt-0.5 text-sm text-[#7f5f69] sm:text-base">{pageSubtitle}</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2.5">
                {pageIcon && <PageIcon name={pageIcon} />}
                <h1 className="text-xl font-bold text-[#2f171f] sm:text-2xl">{pageTitle}</h1>
              </div>
              <p className="mt-0.5 text-sm text-[#9a6070]">{pageSubtitle}</p>
            </>
          )}
        </div>

        {/* Actions area */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Static brand pill — no dropdown, no click */}
          <div
            aria-label="آية حلويات"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#efc8d4] bg-white px-3 py-1.5 shadow-sm"
          >
            <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffe4ef] text-sm">
              🧁
            </span>
            <span className="hidden text-sm font-semibold text-[#4f2d39] sm:inline">آية حلويات</span>
          </div>

          {/* View site — real external link */}
          <a
            href="https://aya-sweets.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="عرض الموقع في تبويب جديد"
            className="inline-flex h-9 items-center gap-1.5 rounded-2xl border border-[#efc8d4] bg-white px-3.5 text-sm font-semibold text-[#4f2d39] shadow-sm transition hover:bg-[#fff4f7] hover:shadow-[0_2px_8px_rgba(232,152,178,0.15)]"
          >
            <span>عرض الموقع</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10L10 2M10 2H5.5M10 2V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Hamburger — mobile / tablet only */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="فتح القائمة الجانبية"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#efc8d4] bg-white text-[#5a2d3b] shadow-sm transition hover:bg-[#fff4f7] lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}
