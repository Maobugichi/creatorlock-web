"use client";

import Link from "next/link";
import Image from "next/image";
import AuthNav from "@/components/ui/authnav";
import Input from "@/components/ui/input";
import { GoogleButton } from "./_components/google-button";
import { useLogin } from "./_hooks/useLogin";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
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
    <div className="min-h-screen w-full bg-[#0C0C0C] flex flex-col">
      <AuthNav prompt="No account?" linkLabel="Sign up" linkHref={signupHref} />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-xs text-white/30 tracking-wide">
              Welcome back, creator
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-[28px] text-white text-center tracking-tight mb-2 md:whitespace-nowrap">
            Sign in to Creator
            <span className="text-brand">
              L
              <Image
                src="/og-icon.svg"
                alt="o"
                width={40}
                height={40}
                priority
                style={{
                  display: "inline-block",
                  width: "0.75em",
                  height: "0.75em",
                  verticalAlign: "-0.2rem",
                }}
              />
              ck
            </span>
          </h1>
          <p className="text-sm text-white/30 text-center mb-8">
            Turn what you know into what you earn.
          </p>

          {/* Card */}
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-7">
            {errorMessage && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                {errorMessage}
              </div>
            )}

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
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/20">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <GoogleButton />
          </div>

          <p className="text-center text-sm text-white/25 mt-6">
            Don&apos;t have an account?{" "}
            <Link href={signupHref} className="text-brand hover:underline">
              Create one free
            </Link>
          </p>

          <p className="text-center text-[11px] text-white/15 mt-4 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;