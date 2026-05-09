"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const preferredLogos = [
  "/assets/logo.png",
  "/assets/logo-removebg-preview.png",
] as const;

export function LoginBrandPanel() {
  const [logoIndex, setLogoIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  const logoSrc = useMemo(() => preferredLogos[logoIndex], [logoIndex]);
  const canTryNext = logoIndex < preferredLogos.length - 1;

  return (
    <div className="relative hidden h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#ffe7ef] via-[#fff2f6] to-[#fdebf1] p-10 lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -top-20 -left-10 h-64 w-64 rounded-full bg-white/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-[#f8bfd0]/35 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-2xl border border-white/60 bg-white/75 shadow-[var(--shadow-soft)]">
          {!showFallback && logoSrc ? (
            <Image
              src={logoSrc}
              alt="Aya Sweets Logo"
              width={96}
              height={96}
              className="h-auto w-auto object-contain"
              onError={() => {
                if (canTryNext) {
                  setLogoIndex((value) => value + 1);
                  return;
                }
                setShowFallback(true);
              }}
            />
          ) : (
            <span className="text-sm font-semibold text-[#9a6c7b]">Aya Sweets</span>
          )}
        </div>

        <h2 className="text-3xl font-bold leading-tight text-[#5a2d3b]">مرحباً بك في لوحة التحكم</h2>
        <p className="mt-3 max-w-md text-base leading-7 text-[#7f5f69]">
          سجل دخولك لإدارة متجرك بسهولة واحترافية
        </p>
      </div>

      <div className="relative z-10 rounded-2xl border border-white/60 bg-white/70 p-5 text-sm leading-7 text-[#7c5663]">
        <p>حلويات طازجة كل يوم، وإدارة أبسط لكل الأصناف والعروض من مكان واحد.</p>
      </div>
    </div>
  );
}
