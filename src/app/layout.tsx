import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aya Sweets Dashboard",
  description: "لوحة تحكم آية سويتس لإدارة التصنيفات والمنتجات والإعدادات الأساسية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
