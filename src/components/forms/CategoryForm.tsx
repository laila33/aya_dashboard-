"use client";

import { useRef, useState } from "react";

import type { Category } from "@/types/category";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { uploadImage } from "@/services/upload.service";

export type CategoryFormData = {
  name: string;
  image: string;
  isActive: boolean;
};

type CategoryFormProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Category | null;
  onSave: (data: CategoryFormData) => void;
  onClose: () => void;
};

const CATEGORY_EMOJI: Record<string, string> = {
  "تورت": "🎂",
  "حلويات شرقية": "🍮",
  "كنافة": "🥧",
  "بسبوسة": "🧁",
  "شوكولاتة": "🍫",
  "عروض خاصة": "🎁",
};

export function CategoryForm({ open, mode, initialData, onSave, onClose }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [preview, setPreview] = useState<string | null>(initialData?.image ?? null);
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setImageError("");

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setImage(imageUrl);
    } catch (error) {
      setImage("");
      setImageError(error instanceof Error ? error.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("اسم القسم مطلوب");
      return;
    }
    if (!image) {
      setImageError(uploading ? "يرجى الانتظار حتى يكتمل رفع الصورة" : "صورة القسم مطلوبة");
      return;
    }
    onSave({ name: name.trim(), image, isActive });
  }

  if (!open) return null;

  const formTitle = mode === "add" ? "إضافة قسم جديد" : "تعديل القسم";
  const displayEmoji = CATEGORY_EMOJI[name] ?? "🍬";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-3xl border border-[#f4d0dc] bg-white shadow-[0_20px_60px_rgba(232,140,170,0.25)]">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-[#fce8f0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0f5] text-xl">
              🗂️
            </div>
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

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          {/* Category name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#3d2730]">
              اسم القسم <span className="text-[#e05080]">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              placeholder="مثال: تورت، كنافة، شوكولاتة..."
              dir="rtl"
              className="border-[#f0d0dc] focus:border-[#ed85a8]"
            />
            {nameError && (
              <p className="text-xs text-[#e05080]">{nameError}</p>
            )}
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#3d2730]">
              صورة القسم
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#f0d0dc] bg-[#fff8fb] text-[#c07080] transition hover:border-[#ed85a8] hover:bg-[#fff2f6] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="معاينة الصورة" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <>
                  <span className="text-3xl">{displayEmoji}</span>
                  <span className="text-xs font-medium">اضغط لرفع صورة</span>
                  <span className="text-xs text-[#b09098]">PNG, JPG حتى 5MB</span>
                </>
              )}
            </button>
            {uploading && (
              <p className="text-xs text-[#b09098]">جارٍ رفع الصورة...</p>
            )}
            {imageError && (
              <p className="text-xs text-[#e05080]">{imageError}</p>
            )}
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-[#f0d8e4] bg-[#fff8fb] px-4 py-3">
            <Switch
              checked={isActive}
              onChange={setIsActive}
              label="حالة القسم"
            />
            <div className="text-right">
              <p className="text-sm font-semibold text-[#3d2730]">الحالة</p>
              <p className="text-xs text-[#9a7080]">{isActive ? "نشط" : "غير نشط"}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={uploading} className="h-11 flex-1 rounded-2xl text-base">
              {uploading ? "جارٍ رفع الصورة..." : "حفظ القسم"}
            </Button>
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
