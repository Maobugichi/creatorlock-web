"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Input from "@/components/ui/input";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ForgotPasswordPage() {
  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: (email: string) =>
      api.post("/auth/forgot-password", { email }).then((r) => r.data),
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate(fd.get("email") as string);
  };

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ??
      "Something went wrong. Please try again."
    : null;

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col font-inter">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="font-syne font-extrabold text-xl text-white tracking-tight">
          Creator<span className="text-brand">Lock</span>
        </div>
        <Link href="/login" className="text-sm text-white/30 hover:text-white/60 transition-colors">
          Back to sign in
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-xs text-white/30 tracking-wide">
              Password recovery
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-[28px] text-white text-center tracking-tight mb-2">
            Forgot your password?
          </h1>
          <p className="text-sm text-white/30 text-center mb-8 font-inter leading-relaxed">
            No stress. Enter your email and we&apos;ll send you a reset link.
          </p>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-7">

            {/* Error */}
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

            {/* Success state */}
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
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="#FB5C06" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="#FB5C06" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-syne font-bold text-white text-lg mb-1">Check your inbox</p>
                    <p className="text-sm text-white/30 font-inter leading-relaxed">
                      If that email exists on CreatorLock, a reset link is on its way. Check your spam too.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="text-sm text-brand hover:underline font-inter mt-2"
                  >
                    Back to sign in
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  exit={{ opacity: 0 }}
                >
                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                  />

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
                  >
                    {isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-white/25 mt-6 font-inter">
            Remembered it?{" "}
            <Link href="/login" className="text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}