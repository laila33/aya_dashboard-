"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isAuthenticated } from "@/services/auth.service";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

type SidebarIconName = "home" | "grid" | "box" | "eye" | "settings";

type PageHeaderConfig = {
  isHome: boolean;
  pageTitle: string;
  pageSubtitle: string;
  pageIcon?: SidebarIconName;
};

const PAGE_CONFIGS: Record<string, PageHeaderConfig> = {
  "/dashboard": {
    isHome: true,
    pageTitle: "مرحباً آية 👋",
    pageSubtitle: "إدارة قائمة المنيو الخاصة بآية حلويات",
  },
  "/dashboard/categories": {
    isHome: false,
    pageTitle: "إدارة الأقسام",
    pageSubtitle: "يمكنك إضافة وتعديل وحذف أقسام المنيو",
    pageIcon: "grid",
  },
  "/dashboard/products": {
    isHome: false,
    pageTitle: "إدارة المنتجات",
    pageSubtitle: "يمكنك إضافة وتعديل وحذف منتجات المنيو",
    pageIcon: "box",
  },
  "/dashboard/settings": {
    isHome: false,
    pageTitle: "الإعدادات",
    pageSubtitle: "إدارة بيانات المتجر والإعدادات الأساسية",
    pageIcon: "settings",
  },
};

const DEFAULT_CONFIG: PageHeaderConfig = PAGE_CONFIGS["/dashboard"];

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const config = PAGE_CONFIGS[pathname] ?? DEFAULT_CONFIG;

  useEffect(() => {
    if (!isAuthenticated()) {
      void router.replace("/login");
      return;
    }
    Promise.resolve().then(() => setAuthReady(true));
  }, [router]);

  if (!authReady) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fff4f7] p-2 sm:p-3 lg:p-4" dir="rtl">
      <div className="mx-auto flex w-full max-w-[1560px] items-start gap-3 lg:gap-4">
        <DashboardSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="min-w-0 flex-1 rounded-[30px] border border-[#f8d5df] bg-[#fffcfd] p-4 shadow-[0_16px_40px_rgba(232,152,178,0.13)] sm:p-5 lg:p-7">
          <DashboardHeader
            isHome={config.isHome}
            pageTitle={config.pageTitle}
            pageSubtitle={config.pageSubtitle}
            pageIcon={config.pageIcon}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="mt-5 min-w-0 text-right">{children}</main>
        </div>
      </div>
    </div>
  );
}
