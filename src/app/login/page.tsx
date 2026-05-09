"use client";

import { motion } from "framer-motion";

import { LoginForm } from "@/components/forms/LoginForm";
import { LoginBrandPanel } from "@/components/login/LoginBrandPanel";

export default function LoginPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen overflow-x-hidden bg-background px-4 py-6 sm:px-8 sm:py-10"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <div className="grid w-full grid-cols-1 gap-6 rounded-3xl border border-border bg-white/75 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm lg:grid-cols-2 lg:gap-8 lg:p-6">
          <LoginBrandPanel />

          <div className="flex items-center justify-center rounded-2xl bg-white/70 p-2 sm:p-4">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
