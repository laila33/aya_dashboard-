"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "@/types/product";
import { Switch } from "@/components/ui/Switch";

type ProductRowProps = {
  product: Product;
  categoryName: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, value: boolean) => void;
  onDuplicate: (product: Product) => void;
};

function ProductThumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className="flex h-14 w-[90px] items-center justify-center rounded-xl bg-[#fff0f5] text-3xl">🍰</div>;
  }
  return (
    <div className="relative h-14 w-[90px] overflow-hidden rounded-xl">
      <Image src={src} alt={alt} fill className="object-cover" onError={() => setFailed(true)} unoptimized />
    </div>
  );
}

export function ProductRow({ product, categoryName, onEdit, onDelete, onToggle, onDuplicate }: ProductRowProps) {
  function handleDelete() {
    if (window.confirm(`هل تريد حذف "${product.name}"؟`)) {
      onDelete(product.id);
    }
  }

  return (
    <tr className="border-t border-[#f8e8ee] transition hover:bg-[#fff9fb]">
      {/* الصورة */}
      <td className="px-4 py-3">
        <ProductThumb src={product.image} alt={product.name} />
      </td>

      {/* اسم المنتج */}
      <td className="px-4 py-3">
        <p className="text-sm font-bold text-[#2d1820]">{product.name}</p>
        {product.description && (
          <p className="mt-0.5 max-w-[200px] text-xs leading-snug text-[#9a7080]">{product.description}</p>
        )}
      </td>

      {/* القسم */}
      <td className="px-4 py-3 text-sm text-[#7f5f69]">{categoryName}</td>

      {/* السعر */}
      <td className="px-4 py-3 text-sm text-[#3d2730]">{product.price} ج.م</td>

      {/* سعر بعد الخصم */}
      <td className="px-4 py-3 text-sm font-semibold text-[#e46f97]">
        {product.hasDiscount && product.priceAfterDiscount
          ? <span>{product.priceAfterDiscount} ج.م</span>
          : <span className="text-[#c0a0b0]">–</span>}
      </td>

      {/* الخصم */}
      <td className="px-4 py-3">
        {product.hasDiscount && product.discountPercent ? (
          <span className="inline-flex items-center rounded-full bg-[#ffe7ef] px-2.5 py-0.5 text-xs font-bold text-[#c0466a]">
            {product.discountPercent}%
          </span>
        ) : (
          <span className="text-sm text-[#c0a0b0]">–</span>
        )}
      </td>

      {/* الحالة */}
      <td className="px-4 py-3">
        <Switch
          checked={product.isActive}
          onChange={(v) => onToggle(product.id, v)}
          label={`حالة ${product.name}`}
        />
      </td>

      {/* العمليات */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff4f7]"
            aria-label="تعديل"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2a1.65 1.65 0 0 1 2.5 2.5L4 12.5H2v-2L9.5 2Z" stroke="#9a6070" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(product)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff4f7]"
            aria-label="نسخ"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="#9a6070" strokeWidth="1.4" />
              <path d="M2 9V2h7" stroke="#9a6070" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff0f2]"
            aria-label="حذف"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.75 3.5h10.5M4.667 3.5V2.333A1.167 1.167 0 0 1 5.833 1.167h2.334a1.167 1.167 0 0 1 1.166 1.166V3.5M11.083 3.5 10.5 12.25a1.167 1.167 0 0 1-1.167 1.083H4.667A1.167 1.167 0 0 1 3.5 12.25L2.917 3.5" stroke="#d05070" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* More */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#f0ccd8] bg-white transition hover:bg-[#fff4f7]"
            aria-label="المزيد"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="2.5" r="1" fill="#9a6070" />
              <circle cx="7" cy="7" r="1" fill="#9a6070" />
              <circle cx="7" cy="11.5" r="1" fill="#9a6070" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
