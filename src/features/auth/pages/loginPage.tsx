"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthNav from "@/components/ui/authnav";
import Input from "@/components/ui/input";
import { useLogin } from "../api/useLogin";
import { GoogleButton } from "../components/google-button";
import { AuthErrorBanner } from "../components/authErrorBanner";

export default function LoginPage() {
  const { mutate, isPending, errorMessage } = useLogin();

  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <AuthNav prompt="No account?" linkLabel="Sign up" linkHref={signupHref} />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground tracking-wide">
              Welcome back, creator
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-[28px] text-foreground text-center tracking-tight mb-2 md:whitespace-nowrap">
            Sign in to Creator<span className="text-logo">Lock</span>
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Turn what you know into what you earn.
          </p>

          <div className="bg-surface border border-border rounded-2xl p-7">
            <AuthErrorBanner message={errorMessage} />

            <GoogleButton />

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
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
              />

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href={signupHref} className="text-primary hover:underline">
              Create one free
            </Link>
          </p>

          <p className="text-center text-[11px] text-muted-foreground/70 mt-4 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link>{" "}and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}