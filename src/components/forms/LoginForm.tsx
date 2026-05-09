"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { isAuthenticated, login, saveAuth } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

function toArabicError(err: unknown): string {
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  if (/invalid|incorrect|wrong|unauthorized|401/i.test(msg))
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  if (/not found|no user|404/i.test(msg))
    return "لا يوجد حساب بهذا البريد الإلكتروني";
  if (/network|failed to fetch|connection/i.test(msg))
    return "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت";
  return "حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مجدداً";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login({ email, password });
      saveAuth(user);
      router.push("/dashboard");
    } catch (err) {
      setError(toArabicError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="w-full rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">تسجيل الدخول</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          أهلاً بعودتك! يرجى إدخال بياناتك للدخول إلى حسابك
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" dir="rtl">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-[#fad0d8] bg-[#fff5f7] px-4 py-3 text-sm text-[#c0446a]"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              كلمة المرور
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-3 pt-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border border-input accent-[#ee89aa]"
                disabled={loading}
              />
              تذكرني
            </label>
            <span className="text-muted-foreground">نسيت كلمة المرور؟</span>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
