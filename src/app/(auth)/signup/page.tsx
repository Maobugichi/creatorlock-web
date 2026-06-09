// app/(auth)/signup/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import AuthNav from "@/components/ui/authnav";
import Input from "@/components/ui/input";
import { useSignup } from "./_hooks/useSignup";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL as string;

const SignupPage = () => {
  const { mutate, isPending, errorMessage } = useSignup();

  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/oauth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col font-inter w-full">
      <AuthNav prompt="Have an account?" linkLabel="Sign in" linkHref={loginHref} />

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-xs text-white/30 tracking-wide font-inter">
              Join 240+ Nigerian creatives
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-white text-center tracking-tight mb-2 leading-tight">
            <span className="inline-flex items-center whitespace-nowrap">
              Join Creator
              <span className="text-brand inline-flex items-center">
                L
                <Image src="/og-icon.svg" alt="o" width={40} height={40} priority className="w-[0.75em] h-[0.75em] relative top-[0.05em]" />
                ck
              </span>
            </span>
          </h1>
          <p className="text-sm text-white/30 text-center mb-7 font-inter">
            Turn what you know into what you earn.
          </p>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7">
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

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.14] text-white/80 hover:text-white font-inter font-medium rounded-xl py-3 text-sm transition-all mb-4"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/20 text-xs font-inter">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                name="email"
                required
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                required
                placeholder="••••••••"
                minLength={8}
              />
              <p className="text-xs text-white/20 font-inter">Minimum 8 characters</p>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/25 mt-5 font-inter">
            Already have an account?{" "}
            <Link href={loginHref} className="text-brand hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-[11px] text-white/15 mt-3 leading-relaxed font-inter">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline so there's no extra import to wire up
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59319 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
);

export default SignupPage;