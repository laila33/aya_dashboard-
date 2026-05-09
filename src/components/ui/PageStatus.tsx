export function PageLoading() {
  return (
    <div className="flex items-center justify-center gap-3 py-20" dir="rtl">
      <svg
        className="h-6 w-6 animate-spin text-[#e5789d]"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm text-[#9a6070]">جارٍ التحميل...</span>
    </div>
  );
}

export function PageError({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border border-[#fad0d8] bg-[#fff5f7] px-6 py-10 text-center"
      dir="rtl"
      role="alert"
    >
      <p className="text-base font-semibold text-[#c0446a]">{message}</p>
      <p className="mt-1 text-sm text-[#9a6070]">يرجى المحاولة مجدداً</p>
    </div>
  );
}
