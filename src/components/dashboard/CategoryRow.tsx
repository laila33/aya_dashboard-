"use client";

import Image from "next/image";
import { useState } from "react";

import type { Category } from "@/types/category";
import { Switch } from "@/components/ui/Switch";

const CATEGORY_EMOJI: Record<string, string> = {
  "تورت": "🎂",
  "حلويات شرقية": "🍮",
  "كنافة": "🥧",
  "بسبوسة": "🧁",
  "شوكولاتة": "🍫",
  "عروض خاصة": "🎁",
};

type CategoryRowProps = {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, newValue: boolean) => void;
};

function CategoryImage({ src, alt, emoji }: { src: string; alt: string; emoji: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-14 w-[88px] items-center justify-center rounded-xl bg-[#fff0f5] text-3xl">
        {emoji}
      </div>
    );
  }
  return (
    <div className="relative h-14 w-[88px] overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}

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

function DragIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="4.5" cy="3" r="1.2" fill="#c8a0b0" />
      <circle cx="9.5" cy="3" r="1.2" fill="#c8a0b0" />
      <circle cx="4.5" cy="7" r="1.2" fill="#c8a0b0" />
      <circle cx="9.5" cy="7" r="1.2" fill="#c8a0b0" />
      <circle cx="4.5" cy="11" r="1.2" fill="#c8a0b0" />
      <circle cx="9.5" cy="11" r="1.2" fill="#c8a0b0" />
    </svg>
  );
}

export function CategoryRow({ category, onEdit, onDelete, onToggle }: CategoryRowProps) {
  const emoji = CATEGORY_EMOJI[category.name] ?? "🍬";

  function handleDelete() {
    if (window.confirm(`هل تريد حذف قسم "${category.name}"؟`)) {
      onDelete(category.id);
    }
  }

  return (
    <tr className="border-t border-[#f8e8ee] transition hover:bg-[#fff9fb]">
      {/* الصورة — rightmost in RTL */}
      <td className="px-4 py-3">
        <CategoryImage src={category.image} alt={category.name} emoji={emoji} />
      </td>

      {/* اسم القسم */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-start gap-2">
          <p className="text-sm font-bold text-[#2d1820]">{category.name}</p>
          <span className="cursor-grab text-[#c8a0b0]" title="سحب لإعادة الترتيب">
            <DragIcon />
          </span>
        </div>
      </td>

      {/* عدد المنتجات */}
      <td className="px-4 py-3 text-center text-sm text-[#7f5f69]">
        {category.productCount} منتجات
      </td>

      {/* الحالة */}
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <Switch
            checked={category.isActive}
            onChange={(val) => onToggle(category.id, val)}
            label={`حالة ${category.name}`}
          />
        </div>
      </td>

      {/* الإجراءات — leftmost in RTL */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff4f7]"
            onClick={() => onEdit(category)}
            aria-label="تعديل"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff0f2]"
            onClick={handleDelete}
            aria-label="حذف"
          >
            <TrashIcon />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff4f7]"
            aria-label="المزيد"
          >
            <DotsIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}
