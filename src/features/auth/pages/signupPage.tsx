"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import AuthNav from "@/components/ui/authnav";
import Input from "@/components/ui/input";
import { GoogleButton } from "@/features/auth/components/google-button";
import { useSignup } from "@/features/auth/api/useSignup";

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

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter w-full">
      <AuthNav prompt="Have an account?" linkLabel="Sign in" linkHref={loginHref} />

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground tracking-wide font-inter">
              Join 240+ Nigerian creatives
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-foreground text-center tracking-tight mb-2 leading-tight">
            Join Creator<span className="text-logo">Lock</span>
          </h1>

          <p className="text-sm text-muted-foreground text-center mb-7 font-inter">
            Turn what you know into what you earn.
          </p>

          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-7">
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-status-exception/8 border border-status-exception/20 text-status-exception text-sm rounded-xl px-4 py-3 mb-5 font-inter"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <GoogleButton />

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-xs font-inter">or</span>
              <div className="flex-1 h-px bg-border" />
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
              <p className="text-xs text-muted-foreground font-inter">Minimum 8 characters</p>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5 font-inter">
            Already have an account?{" "}
            <Link href={loginHref} className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-center text-[11px] text-muted-foreground/70 mt-3 leading-relaxed font-inter">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;