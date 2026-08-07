"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import AuthNav from "@/components/ui/authnav";
import Input from "@/components/ui/input";
import { useForgotPassword } from "../api/useForgotPassword";
import { AuthErrorBanner } from "../components/authErrorBanner";
import { ForgotPasswordSuccess } from "../components/forgotPasswordSuccess";
import type { ApiError } from "../types/auth.types";

export default function ForgotPasswordPage() {
  const { mutate, isPending, isError, isSuccess, error } = useForgotPassword();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate(fd.get("email") as string);
  };

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ?? "Something went wrong. Please try again."
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter w-full">
      <AuthNav />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground tracking-wide">Password recovery</span>
          </div>

          <h1 className="font-syne font-extrabold text-[28px] text-foreground text-center tracking-tight mb-2">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8 font-inter leading-relaxed">
            No stress. Enter your email and we&apos;ll send you a reset link.
          </p>

          <div className="bg-surface border border-border rounded-2xl p-7">
            <AuthErrorBanner message={errorMessage} />

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <ForgotPasswordSuccess />
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
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
                  >
                    {isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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

          <p className="text-center text-sm text-muted-foreground mt-6 font-inter">
            Remembered it?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}