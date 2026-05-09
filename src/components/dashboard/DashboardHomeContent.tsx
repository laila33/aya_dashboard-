"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Category, CategoryStats } from "@/types/category";
import type { Product } from "@/types/product";
import { getCategories, getCategoryStats } from "@/services/categories.service";
import { getProducts } from "@/services/products.service";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/Card";
import { PageError, PageLoading } from "@/components/ui/PageStatus";
import { ROUTES } from "@/lib/constants";

const CATEGORY_EMOJI: Record<string, string> = {
  "تورت": "🎂",
  "حلويات شرقية": "🍮",
  "كنافة": "🥧",
  "بسبوسة": "🧁",
  "شوكولاتة": "🍫",
  "عروض خاصة": "🎁",
};

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10.5 2a1.768 1.768 0 0 1 2.5 2.5L4.375 13H2v-2.375L10.5 2Z" stroke="#9a6070" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1.875 3.75h11.25M5 3.75V2.5A1.25 1.25 0 0 1 6.25 1.25h2.5A1.25 1.25 0 0 1 10 2.5v1.25M11.875 3.75 11.25 13a1.25 1.25 0 0 1-1.25 1.25h-5A1.25 1.25 0 0 1 3.75 13L3.125 3.75" stroke="#d05070" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="3" r="1.1" fill="#9a6070" />
      <circle cx="7.5" cy="7.5" r="1.1" fill="#9a6070" />
      <circle cx="7.5" cy="12" r="1.1" fill="#9a6070" />
    </svg>
  );
}

function ProductImageCell({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className="flex h-14 w-[88px] items-center justify-center rounded-xl bg-[#fff0f5] text-3xl">🍰</div>;
  }
  return (
    <div className="relative h-14 w-[88px] overflow-hidden rounded-xl">
      <Image src={src} alt={alt} fill className="object-cover" onError={() => setFailed(true)} unoptimized />
    </div>
  );
}

function HomeProductsDisplay({ products, categoryNameById }: {
  products: Product[];
  categoryNameById: Record<string, string>;
}) {
  const rows = products.slice(0, 4);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#f2d0db]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-right">
          <thead className="bg-[#ffeff4]">
            <tr>
              {["الصورة", "اسم المنتج", "القسم", "السعر", "سعر بعد الخصم", "الخصم", "الإجراءات"].map((h) => (
                <th key={h} className="px-4 py-3.5 text-sm font-semibold text-[#6f4c59]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#f8e8ee]">
                <td className="px-4 py-3"><ProductImageCell src={row.image} alt={row.name} /></td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-[#2d1820]">{row.name}</p>
                  {row.description && <p className="mt-0.5 max-w-[220px] text-xs leading-snug text-[#9a7080]">{row.description}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-[#7f5f69]">{categoryNameById[row.categoryId] ?? row.categoryId}</td>
                <td className="px-4 py-3 text-sm text-[#3d2730]">{row.price} ج.م</td>
                <td className="px-4 py-3 text-sm font-medium text-[#e46f97]">
                  {row.hasDiscount && row.priceAfterDiscount ? `${row.priceAfterDiscount} ج.م` : "–"}
                </td>
                <td className="px-4 py-3">
                  {row.hasDiscount && row.discountPercent ? (
                    <span className="inline-flex items-center rounded-full bg-[#ffe7ef] px-2.5 py-0.5 text-xs font-semibold text-[#c0466a]">{row.discountPercent}%</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-[#f5f5f5] px-2.5 py-0.5 text-xs text-[#9a8090]">لا يوجد</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 opacity-40">
                    {[<EditIcon key="e" />, <TrashIcon key="t" />, <DotsIcon key="d" />].map((icon, i) => (
                      <span key={i} className="flex h-8 w-8 cursor-default items-center justify-center rounded-xl border border-[#f0ccd8] bg-white">{icon}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardHomeContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<CategoryStats | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCategories(), getProducts(), getCategoryStats()])
      .then(([cats, prods, st]) => {
        if (cancelled) return;
        setCategories(cats);
        setProducts(prods);
        setStats(st);
      })
      .catch(() => {
        if (!cancelled) setError("حدث خطأ أثناء تحميل البيانات");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const totalProducts = stats?.totalProducts ?? categories.reduce((s, c) => s + c.productCount, 0);
  const totalCategories = stats?.totalCategories ?? categories.length;
  const categoryNameById = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-5">
      {/* Stats cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatsCard
          count={String(totalProducts)}
          unit="منتج"
          title="إجمالي المنتجات"
          actionLabel="إضافة منتج جديد"
          iconType="products"
          href={ROUTES.products}
        />
        <StatsCard
          count={String(totalCategories)}
          unit="أقسام"
          title="إجمالي الأقسام"
          actionLabel="إضافة قسم جديد"
          iconType="categories"
          href={ROUTES.categories}
        />
      </section>

      {/* Categories section */}
      <section>
        <Card className="rounded-3xl border-[#f4d3dd] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href={ROUTES.categories}
              className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-l from-[var(--primary-from)] to-[var(--primary-to)] px-4 text-sm font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow-soft)] transition hover:opacity-95"
            >
              + إضافة قسم جديد
            </Link>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#2f171f]">الأقسام</h2>
              <span className="text-xl">🧁</span>
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f0c8d5] bg-white text-[#c06080] shadow-sm transition hover:bg-[#fff4f7]"
              aria-label="السابق"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-1">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    name={cat.name}
                    emoji={CATEGORY_EMOJI[cat.name] ?? "🍬"}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Products section */}
      <section>
        <Card className="rounded-3xl border-[#f4d3dd] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href={ROUTES.products}
              className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-l from-[var(--primary-from)] to-[var(--primary-to)] px-4 text-sm font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow-soft)] transition hover:opacity-95"
            >
              + إضافة منتج جديد
            </Link>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#2f171f]">المنتجات</h2>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="3.5" stroke="#e5789d" strokeWidth="1.6" />
                <line x1="6" y1="8" x2="16" y2="8" stroke="#e5789d" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="6" y1="12" x2="13" y2="12" stroke="#e5789d" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="6" y1="16" x2="10" y2="16" stroke="#e5789d" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <HomeProductsDisplay products={products} categoryNameById={categoryNameById} />
        </Card>
      </section>

      {/* Footer */}
      <p className="pb-2 text-center text-sm text-[#e06090]">
        ♡ كل قطعة تصنع بحب، من آية لقلوبكم ♡
      </p>
    </div>
  );
}
