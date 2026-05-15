"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Input from "@/components/ui/input";
import AuthNav from "@/components/ui/authnav";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: (data: { token: string; new_password: string }) =>
      api.post("/auth/reset-password", data).then((r) => r.data),
    onSuccess: () => {
      setTimeout(() => router.push("/login"), 2000);
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    const new_password = fd.get("new_password") as string;
    const confirm = fd.get("confirm_password") as string;

    if (new_password !== confirm) {
      return;
    }

    mutate({ token, new_password });
  };

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ??
      "Invalid or expired reset link. Please request a new one."
    : null;

 
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4 font-inter">
        <div className="text-center max-w-sm">
          <div className="font-syne font-extrabold text-xl text-white mb-2">
            Creator<span className="text-brand">Lock</span>
          </div>
          <p className="text-white/40 text-sm mb-4">
            This reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="text-brand hover:underline text-sm"
          >
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col font-inter w-full">

      <AuthNav  linkLabel="Back to login" linkHref="/login"/>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-xs text-white/30 tracking-wide">
              Set a new password
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-[28px] text-white text-center tracking-tight mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-white/30 text-center mb-8 font-inter">
            Choose a strong password you haven&apos;t used before.
          </p>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-7">

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 font-inter"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-4 py-4"
                >
                  <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L20 7" stroke="#FB5C06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-syne font-bold text-white text-lg mb-1">Password updated!</p>
                    <p className="text-sm text-white/30 font-inter">
                      Redirecting you to sign in...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  exit={{ opacity: 0 }}
                >
                  <Input
                    label="New password"
                    type="password"
                    name="new_password"
                    required
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    name="confirm_password"
                    required
                    placeholder="••••••••"
                    minLength={8}
                  />

                  <p className="text-xs text-white/20 font-inter">
                    Minimum 8 characters
                  </p>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
                  >
                    {isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}