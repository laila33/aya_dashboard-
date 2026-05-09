"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { Store } from "@/types/store";
import { getSettings, updateSettings } from "@/services/store.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageError, PageLoading } from "@/components/ui/PageStatus";
import { Toast, useToast } from "@/components/ui/Toast";

const DESCRIPTION_MAX = 200;

const CURRENCIES = [
  "جنيه مصري (ج.م)",
  "ريال سعودي (ر.س)",
  "درهم إماراتي (د.إ)",
  "دولار أمريكي ($)",
];

export function StoreSettingsForm() {
  const [data, setData] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form fields — populated once data loads
  const [storeName, setStoreName] = useState("");
  const [subName, setSubName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const { message: toastMsg, showToast } = useToast();

  // Fetch on mount
  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((s) => {
        if (cancelled) return;
        setData(s);
        setStoreName(s.storeName);
        setSubName(s.subName);
        setDescription(s.description);
        setPhoneNumber(s.phoneNumber);
        setEmail(s.email);
        setAddress(s.address);
        setCurrency(s.currency);
        setLogoSrc(s.logo);
      })
      .catch(() => {
        if (!cancelled) setFetchError("حدث خطأ أثناء تحميل إعدادات المتجر");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <PageLoading />;
  if (fetchError || !data) return <PageError message={fetchError ?? "تعذّر تحميل الإعدادات"} />;

  const currentLogo = logoPreview ?? logoSrc;

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!storeName.trim()) errs.storeName = "اسم المتجر مطلوب";
    if (!phoneNumber.trim()) errs.phoneNumber = "رقم الهاتف مطلوب";
    if (!email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const updated = await updateSettings({
        storeName,
        subName,
        description,
        phoneNumber,
        email,
        address,
        currency,
        logo: logoSrc,
      });
      setData(updated);
      setLogoSrc(updated.logo);
      setLogoPreview(null);
      showToast("تم حفظ الإعدادات بنجاح");
    } catch {
      showToast("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  }

  function clearErr(key: string) {
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  return (
    <>
      <form onSubmit={handleSubmit} dir="rtl">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">

          {/* ── RIGHT card: store info ──────────────────────────── */}
          <div className="rounded-3xl border border-[#f4d0dc] bg-white p-6 shadow-[0_4px_20px_rgba(232,152,178,0.1)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0f5]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2a7 7 0 1 0 0 14A7 7 0 0 0 9 2Z" stroke="#e5789d" strokeWidth="1.5" />
                  <path d="M9 6v4l2.5 2.5" stroke="#e5789d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#2d1820]">معلومات المتجر</h3>
            </div>

            <div className="space-y-4">
              <Field label="اسم المتجر" required error={errors.storeName}>
                <Input
                  value={storeName}
                  onChange={(e) => { setStoreName(e.target.value); clearErr("storeName"); }}
                  placeholder="مثال: آية حلويات"
                  dir="rtl"
                  className="border-[#f0d0dc]"
                />
              </Field>

              <Field label="الاسم الفرعي / الشعار النصي">
                <Input
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="للحلويات الشرقية والغربية"
                  dir="rtl"
                  className="border-[#f0d0dc]"
                />
              </Field>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#3d2730]">وصف المتجر</label>
                  <span className={`text-xs ${description.length > DESCRIPTION_MAX ? "text-[#e05080]" : "text-[#b09098]"}`}>
                    {description.length} / {DESCRIPTION_MAX}
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={DESCRIPTION_MAX + 50}
                  placeholder="وصف مختصر يظهر للعملاء في المنيو..."
                  dir="rtl"
                  className="w-full resize-none rounded-xl border border-[#f0d0dc] bg-white px-3 py-2.5 text-sm text-[#3d2730] outline-none placeholder:text-[#b09098] focus:border-[#ed85a8]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="رقم الهاتف" required error={errors.phoneNumber}>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value); clearErr("phoneNumber"); }}
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="border-[#f0d0dc] text-left"
                  />
                </Field>
                <Field label="البريد الإلكتروني" required error={errors.email}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
                    placeholder="example@gmail.com"
                    dir="ltr"
                    className="border-[#f0d0dc] text-left"
                  />
                </Field>
              </div>

              <Field label="العنوان">
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المدينة، الدولة"
                  dir="rtl"
                  className="border-[#f0d0dc]"
                />
              </Field>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-[#3d2730]">العملة</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  dir="rtl"
                  className="h-11 w-full rounded-xl border border-[#f0d0dc] bg-white px-3 text-sm text-[#3d2730] outline-none focus:border-[#ed85a8]"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {/* Keep current value even if not in the list */}
                  {currency && !CURRENCIES.includes(currency) && (
                    <option value={currency}>{currency}</option>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit" className="h-11 rounded-2xl px-8 text-base" disabled={saving}>
                {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </div>

          {/* ── LEFT card: logo ────────────────────────────────── */}
          <div className="rounded-3xl border border-[#f4d0dc] bg-white p-6 shadow-[0_4px_20px_rgba(232,152,178,0.1)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0f5]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="#e5789d" strokeWidth="1.5" />
                  <circle cx="6.5" cy="6.5" r="1.5" stroke="#e5789d" strokeWidth="1.3" />
                  <path d="M2 12l4-4 3 3 2-2 5 5" stroke="#e5789d" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#2d1820]">شعار المتجر</h3>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-[#f2d0db] bg-[#fff8fb]">
                {currentLogo ? (
                  <Image
                    src={currentLogo}
                    alt="شعار المتجر"
                    fill
                    className="object-contain p-4"
                    unoptimized
                    onError={() => {
                      setLogoPreview(null);
                      setLogoSrc("/assets/logo.png");
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#c0a0b0]">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="14" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 28l10-10 7 7 5-5 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm">لا يوجد شعار</p>
                  </div>
                )}
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f0d0dc] bg-white py-2.5 text-sm font-semibold text-[#5c3340] transition hover:bg-[#fff4f7]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="#c06080" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                تغيير الشعار
              </button>

              <p className="text-center text-xs leading-relaxed text-[#b09098]">
                يُنصح بصورة مربعة بحجم لا يقل عن 300×300 بكسل
                <br />
                بصيغة PNG أو JPG أو WEBP
              </p>
            </div>
          </div>

        </div>
      </form>

      <Toast message={toastMsg} />
    </>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-[#3d2730]">
        {label}
        {required && <span className="mr-1 text-[#e05080]">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#e05080]">{error}</p>}
    </div>
  );
}
