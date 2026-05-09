"use client";

import { useEffect, useState } from "react";

import type { Category } from "@/types/category";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/services/categories.service";
import { CategoryRow } from "@/components/dashboard/CategoryRow";
import { CategoryForm, type CategoryFormData } from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageError, PageLoading } from "@/components/ui/PageStatus";
import { Toast, useToast } from "@/components/ui/Toast";

type StatsCardMiniProps = {
  count: number;
  label: string;
  icon: React.ReactNode;
};

function StatsMini({ count, label, icon }: StatsCardMiniProps) {
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

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { message: toastMsg, showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch(() => { if (!cancelled) setError("حدث خطأ أثناء تحميل الأقسام"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
  const activeCount = categories.filter((c) => c.isActive).length;

  function openAdd() {
    setEditingCategory(null);
    setFormKey((k) => k + 1);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingCategory(cat);
    setFormKey((k) => k + 1);
    setModalOpen(true);
  }

  async function handleSave(data: CategoryFormData) {
    if (editingCategory) {
      try {
        const updatedCat = await updateCategory(editingCategory.id, data);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updatedCat : c)),
        );
        showToast("تم تحديث القسم بنجاح");
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر تحديث القسم";
        showToast(message);
        return;
      }
    } else {
      try {
        const newCat = await createCategory(data);
        setCategories((prev) => [...prev, newCat]);
        showToast("تم إضافة القسم بنجاح");
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر إضافة القسم";
        showToast(message);
        return;
      }
    }
    setModalOpen(false);
    setEditingCategory(null);
  }

  function handleDelete(id: string) {
    deleteCategory(id)
      .then(() => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast("تم حذف القسم بنجاح");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "تعذر حذف القسم";
        showToast(message);
      });
  }

  function handleToggle(id: string, newValue: boolean) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newValue } : c)),
    );
  }

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <>
      {/* Add button */}
      <div className="mb-5">
        <Button
          type="button"
          onClick={openAdd}
          className="h-10 rounded-full px-5 text-sm"
        >
          + إضافة قسم جديد
        </Button>
      </div>

      {/* Stats mini-cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatsMini
          count={categories.length}
          label="إجمالي الأقسام"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
              <rect x="12.5" y="2.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
              <rect x="2.5" y="12.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
              <rect x="12.5" y="12.5" width="7" height="7" rx="1.5" stroke="#e5789d" strokeWidth="1.6" />
            </svg>
          }
        />
        <StatsMini
          count={totalProducts}
          label="إجمالي المنتجات"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 6h14l-1.5 9a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 15L4 6Z" stroke="#e5789d" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 6V5a3 3 0 0 1 6 0v1" stroke="#e5789d" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />
        <StatsMini
          count={activeCount}
          label="الأقسام النشطة"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="8.5" stroke="#e5789d" strokeWidth="1.6" />
              <path d="M7.5 11l2.5 2.5 4.5-5" stroke="#e5789d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border-[#f2d0db] p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-right">
            <thead className="bg-[#ffeff4]">
              <tr>
                <th className="px-4 py-3.5 text-sm font-semibold text-[#6f4c59]">الصورة</th>
                <th className="px-4 py-3.5 text-sm font-semibold text-[#6f4c59]">اسم القسم</th>
                <th className="px-4 py-3.5 text-center text-sm font-semibold text-[#6f4c59]">عدد المنتجات</th>
                <th className="px-4 py-3.5 text-center text-sm font-semibold text-[#6f4c59]">الحالة</th>
                <th className="px-4 py-3.5 text-center text-sm font-semibold text-[#6f4c59]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#b09098]">
                    لا توجد أقسام بعد — أضف قسمًا جديدًا
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer text */}
      <p className="mt-5 pb-1 text-center text-sm text-[#e06090]">
        ♡ كل قسم يحمل مذاق السعادة ♡
      </p>

      {/* Add / Edit modal — key changes on every open so state always resets */}
      <CategoryForm
        key={formKey}
        open={modalOpen}
        mode={editingCategory ? "edit" : "add"}
        initialData={editingCategory}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
      />

      <Toast message={toastMsg} />
    </>
  );
}
