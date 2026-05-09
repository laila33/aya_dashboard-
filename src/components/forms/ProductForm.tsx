"use client";

import { useRef, useState } from "react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";

export type ProductFormData = {
  name: string;
  description: string;
  image: string;
  categoryId: string;
  price: number;
  discountPercent: number | undefined;
  priceAfterDiscount: number | undefined;
  isActive: boolean;
  hasDiscount: boolean;
};

type ProductFormProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Product | null;
  categories: Category[];
  onSave: (data: ProductFormData) => void;
  onClose: () => void;
};

export function ProductForm({ open, mode, initialData, categories, onSave, onClose }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [hasDiscount, setHasDiscount] = useState(initialData?.hasDiscount ?? false);
  const [price, setPrice] = useState<string>(initialData?.price ? String(initialData.price) : "");
  const [discountPct, setDiscountPct] = useState<string>(
    initialData?.discountPercent ? String(initialData.discountPercent) : "",
  );
  const [preview, setPreview] = useState<string | null>(initialData?.image ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const priceNum = parseFloat(price) || 0;
  const discountNum = parseFloat(discountPct) || 0;
  const priceAfterDiscount = hasDiscount && priceNum > 0 && discountNum > 0
    ? Math.round(priceNum * (1 - discountNum / 100))
    : undefined;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setImage(url);
    setErrors((prev) => ({ ...prev, image: "" }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "اسم المنتج مطلوب";
    if (!categoryId) errs.category = "القسم مطلوب";
    if (!image) errs.image = "الصورة مطلوبة";
    if (!price || priceNum <= 0) errs.price = "السعر مطلوب";
    if (hasDiscount && (discountNum <= 0 || discountNum >= 100)) errs.discount = "نسبة الخصم يجب أن تكون بين 1 و 99";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      name: name.trim(),
      description: description.trim(),
      image,
      categoryId,
      price: priceNum,
      isActive,
      hasDiscount,
      discountPercent: hasDiscount ? discountNum : undefined,
      priceAfterDiscount: hasDiscount ? priceAfterDiscount : undefined,
    });
  }

  if (!open) return null;

  const formTitle = mode === "add" ? "إضافة منتج جديد" : "تعديل المنتج";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl border border-[#f4d0dc] bg-white shadow-[0_20px_60px_rgba(232,140,170,0.25)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#fce8f0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0f5] text-xl">🛍️</div>
            <h2 className="text-lg font-bold text-[#2f171f]">{formTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0d0dc] bg-white text-[#9a6070] transition hover:bg-[#fff4f7]"
            aria-label="إغلاق"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#3d2730]">
              اسم المنتج <span className="text-[#e05080]">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="مثال: تورتة شوكولاتة فاخرة..."
              dir="rtl"
              className="border-[#f0d0dc]"
            />
            {errors.name && <p className="text-xs text-[#e05080]">{errors.name}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#3d2730]">
              القسم <span className="text-[#e05080]">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setErrors((p) => ({ ...p, category: "" })); }}
              className="h-11 w-full rounded-xl border border-[#f0d0dc] bg-white px-3 text-sm text-[#3d2730] outline-none focus:border-[#ed85a8]"
              dir="rtl"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-[#e05080]">{errors.category}</p>}
          </div>

          {/* Image upload */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#3d2730]">الصورة الرئيسية للمنتج</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#f0d0dc] bg-[#fff8fb] text-[#c07080] transition hover:border-[#ed85a8] hover:bg-[#fff2f6]"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="معاينة" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <>
                  <span className="text-2xl">📸</span>
                  <span className="text-xs font-medium">اضغط لرفع صورة</span>
                </>
              )}
            </button>
            {errors.image && <p className="text-xs text-[#e05080]">{errors.image}</p>}
          </div>

          {/* Status + price row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Status */}
            <div className="flex items-center justify-between rounded-xl border border-[#f0d8e4] bg-[#fff8fb] px-3 py-2.5">
              <Switch checked={isActive} onChange={setIsActive} label="الحالة" />
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3d2730]">الحالة</p>
                <p className="text-xs text-[#9a7080]">{isActive ? "نشط" : "غير نشط"}</p>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#3d2730]">
                سعر المنتج <span className="text-[#e05080]">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: "" })); }}
                  placeholder="0"
                  className="border-[#f0d0dc] pl-12"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9a7080]">ج.م</span>
              </div>
              {errors.price && <p className="text-xs text-[#e05080]">{errors.price}</p>}
            </div>
          </div>

          {/* Discount toggle */}
          <div className="flex items-center justify-between rounded-xl border border-[#f0d8e4] bg-[#fff8fb] px-4 py-2.5">
            <Switch checked={!hasDiscount} onChange={(v) => setHasDiscount(!v)} label="لا يوجد خصم" />
            <p className="text-sm font-semibold text-[#3d2730]">لا يوجد خصم</p>
          </div>

          {/* Discount fields */}
          {hasDiscount && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#3d2730]">نسبة الخصم %</label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={discountPct}
                    onChange={(e) => { setDiscountPct(e.target.value); setErrors((p) => ({ ...p, discount: "" })); }}
                    placeholder="0"
                    className="border-[#f0d0dc] pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9a7080]">%</span>
                </div>
                {errors.discount && <p className="text-xs text-[#e05080]">{errors.discount}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#3d2730]">سعر بعد الخصم</label>
                <div className="relative">
                  <Input
                    readOnly
                    value={priceAfterDiscount !== undefined ? String(priceAfterDiscount) : ""}
                    placeholder="يُحسب تلقائيًا"
                    className="border-[#f0d0dc] pl-12 bg-[#fdf8fa]"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9a7080]">ج.م</span>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#3d2730]">وصف المنتج</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="وصف مختصر للمنتج..."
              dir="rtl"
              className="w-full rounded-xl border border-[#f0d0dc] bg-white px-3 py-2.5 text-sm text-[#3d2730] outline-none placeholder:text-[#b09098] focus:border-[#ed85a8] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button type="submit" className="h-11 flex-1 rounded-2xl text-base">حفظ المنتج</Button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-2xl border border-[#f0d0dc] bg-white text-base font-semibold text-[#5c3340] transition hover:bg-[#fff4f7]"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
