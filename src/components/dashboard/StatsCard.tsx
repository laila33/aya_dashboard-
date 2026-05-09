import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type StatsCardProps = {
  count: string;
  unit: string;
  title: string;
  actionLabel: string;
  iconType: "categories" | "products";
  href: string;
};

function CategoriesIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="11" height="11" rx="3" stroke="#e5789d" strokeWidth="2" />
      <rect x="18" y="3" width="11" height="11" rx="3" stroke="#e5789d" strokeWidth="2" />
      <rect x="3" y="18" width="11" height="11" rx="3" stroke="#e5789d" strokeWidth="2" />
      <rect x="18" y="18" width="11" height="11" rx="3" stroke="#e5789d" strokeWidth="2" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="4" stroke="#e5789d" strokeWidth="2" />
      <line x1="9" y1="12" x2="23" y2="12" stroke="#e5789d" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="17" x2="20" y2="17" stroke="#e5789d" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="22" x2="17" y2="22" stroke="#e5789d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StatsCard({ count, unit, title, actionLabel, iconType, href }: StatsCardProps) {
  return (
    <Card className="rounded-3xl border-[#f4d1dc] bg-white p-6 text-right sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-5xl font-bold leading-tight text-[#2d1820]">
            {count}{" "}
            <span className="text-3xl font-semibold text-[#e5789d]">{unit}</span>
          </p>
          <p className="mt-1 text-xl text-[#5e3a47]">{title}</p>
        </div>
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#f5d9e2] bg-[#fff4f7]">
          {iconType === "categories" ? <CategoriesIcon /> : <ProductsIcon />}
        </div>
      </div>

      <Link
        href={href}
        className={cn(
          "mt-6 inline-flex h-11 items-center justify-center rounded-full px-7 text-base font-semibold transition",
          "bg-gradient-to-l from-[var(--primary-from)] to-[var(--primary-to)] text-[var(--primary-foreground)] shadow-[var(--shadow-soft)] hover:opacity-95",
        )}
      >
        + {actionLabel}
      </Link>
    </Card>
  );
}
