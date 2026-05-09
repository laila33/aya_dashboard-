"use client";

import { useEffect, useMemo, useState } from "react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { getCategories } from "@/services/categories.service";
import { createProduct, deleteProduct, getProducts, updateProduct } from "@/services/products.service";
import { ProductRow } from "@/components/dashboard/ProductRow";
import { ProductForm, type ProductFormData } from "@/components/forms/ProductForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageError, PageLoading } from "@/components/ui/PageStatus";
import { Toast, useToast } from "@/components/ui/Toast";

const PER_PAGE = 10;

// ── Mini stat card ────────────────────────────────────────────────────────────

function StatsMini({ count, label, icon }: { count: number; label: string; icon: React.ReactNode }) {
  return (
    <Card className="flex items-center gap-3 rounded-2xl border-[#f4d1dc] bg-white px-4 py-3 text-right shadow-[0_4px_14px_rgba(232,152,178,0.1)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f5d9e2] bg-[#fff4f7]">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold leading-tight text-[#2d1820]">{count}</p>
        <p className="text-xs text-[#7f5f69]">{label}</p>
      </div>
    </Card>
  );
}

// ── Filter select ─────────────────────────────────────────────────────────────

function FilterSelect({ value, onChange, children }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="rtl"
        className="h-10 appearance-none rounded-2xl border border-[#f0d0dc] bg-white pl-8 pr-4 text-sm text-[#3d2730] outline-none focus:border-[#ed85a8]"
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M1 1.5L6 6.5L11 1.5" stroke="#9a6070" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const { message: toastMsg, showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        if (cancelled) return;
        setProducts(prods);
        setCategories(cats);
      })
      .catch(() => { if (!cancelled) setError("حدث خطأ أثناء تحميل المنتجات"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  // ── Stats ──
  const totalProducts = products.length;
  const discountCount = products.filter((p) => p.hasDiscount).length;
  const activeCount = products.filter((p) => p.isActive).length;

  // ── Filtered list ──
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = search === "" || p.name.includes(search) || p.description.includes(search);
      const matchStatus = statusFilter === "all"
        || (statusFilter === "active" && p.isActive)
        || (statusFilter === "inactive" && !p.isActive);
      const matchCat = categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // ── Handlers ──
  function openAdd() {
    setEditingProduct(null);
    setFormKey((k) => k + 1);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormKey((k) => k + 1);
    setModalOpen(true);
  }

  async function handleSave(data: ProductFormData) {
    if (editingProduct) {
      try {
        const updatedProduct = await updateProduct(editingProduct.id, {
          name: data.name,
          description: data.description,
          price: data.price,
          discount: data.discountPercent ?? 0,
          image: data.image,
          category: data.categoryId,
          isActive: data.isActive,
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
        );
        showToast("تم تحديث المنتج بنجاح");
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر تحديث المنتج";
        showToast(message);
        return;
      }
    } else {
      try {
        const createdProduct = await createProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          discount: data.discountPercent ?? 0,
          image: data.image,
          category: data.categoryId,
          isActive: data.isActive,
        });
        setProducts((prev) => [createdProduct, ...prev]);
        setPage(1);
        showToast("تم إضافة المنتج بنجاح");
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر إضافة المنتج";
        showToast(message);
        return;
      }
    }
    setModalOpen(false);
    setEditingProduct(null);
  }

  function handleDelete(id: string) {
    deleteProduct(id)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast("تم حذف المنتج بنجاح");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "تعذر حذف المنتج";
        showToast(message);
      });
  }

  function handleToggle(id: string, value: boolean) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: value } : p));
  }

  function handleDuplicate(product: Product) {
    const copy: Product = {
      ...product,
      id: `prd-${Date.now()}`,
      name: `${product.name} (نسخة)`,
    };
    setProducts((prev) => [copy, ...prev]);
    setPage(1);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <>
      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatsMini
          count={totalProducts}
          label="إجمالي المنتجات"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 5.5h14M7 5.5V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.5M5.5 5.5l1 11A1.5 1.5 0 0 0 8 18h6a1.5 1.5 0 0 0 1.5-1.5l1-11" stroke="#e5789d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatsMini
          count={discountCount}
          label="منتجات عليها خصم"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="8.5" stroke="#e5789d" strokeWidth="1.6" />
              <path d="M7.5 14.5l7-7M8.5 9a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM13.5 14a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" stroke="#e5789d" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }
        />
        <StatsMini
          count={activeCount}
          label="منتجات نشطة"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="8.5" stroke="#e5789d" strokeWidth="1.6" />
              <path d="M7.5 11l2.5 2.5 4.5-5" stroke="#e5789d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      {/* Controls */}
      <div className="mb-5 space-y-3">
        {/* Row 1: Add button */}
        <div>
          <Button type="button" onClick={openAdd} className="h-10 rounded-full px-5 text-sm">
            + إضافة منتج جديد
          </Button>
        </div>

        {/* Row 2: Search + filters — stacks vertically on mobile, row on sm+ */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-[220px]">
            <input
              value={search}
              onChange={handleSearchChange}
              dir="rtl"
              placeholder="بحث عن منتج..."
              className="h-10 w-full rounded-2xl border border-[#f0d0dc] bg-white pl-9 pr-4 text-sm text-[#3d2730] outline-none placeholder:text-[#b09098] focus:border-[#ed85a8]"
            />
            <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#b09098" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#b09098" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Status filter */}
          <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </FilterSelect>

          {/* Category filter */}
          <FilterSelect value={categoryFilter} onChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <option value="all">جميع الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </FilterSelect>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border-[#f2d0db] p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right">
            <thead className="bg-[#ffeff4]">
              <tr>
                {["الصورة", "اسم المنتج", "القسم", "السعر", "سعر بعد الخصم", "الخصم", "الحالة", "العمليات"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-sm font-semibold text-[#6f4c59]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginated.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  categoryName={categoryNameById[product.categoryId] ?? product.categoryId}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  onDuplicate={handleDuplicate}
                />
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#b09098]">
                    لا توجد منتجات مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#7f5f69]">
          عرض {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1} – {Math.min(safePage * PER_PAGE, filtered.length)} من {filtered.length} منتج
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0d0dc] bg-white text-sm text-[#9a6070] transition hover:bg-[#fff4f7] disabled:opacity-40"
            aria-label="السابق"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M7 8L4 5L7 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={p === safePage
                ? "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-l from-[#f4a0ba] to-[#ed85a8] text-sm font-bold text-white shadow-sm"
                : "flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0d0dc] bg-white text-sm text-[#5c3340] transition hover:bg-[#fff4f7]"}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0d0dc] bg-white text-sm text-[#9a6070] transition hover:bg-[#fff4f7] disabled:opacity-40"
            aria-label="التالي"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3 8L6 5L3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#7f5f69]">
          <span>لكل صفحة</span>
          <span className="font-semibold text-[#3d2730]">{PER_PAGE}</span>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 pb-1 text-center text-sm text-[#e06090]">
        ♡ كل منتج يحمل لمسة من حب آية ♡
      </p>

      {/* Modal */}
      <ProductForm
        key={formKey}
        open={modalOpen}
        mode={editingProduct ? "edit" : "add"}
        initialData={editingProduct}
        categories={categories}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
      />

      <Toast message={toastMsg} />
    </>
  );
}
