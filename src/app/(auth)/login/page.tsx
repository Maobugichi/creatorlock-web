"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import Input from "@/components/ui/input";
import Image from "next/image";
import AuthNav from "@/components/ui/authnav";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: "creator" | "buyer" | "admin";
  };
  accessToken: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: LoginInput) =>
      api.post<LoginResponse>("/auth/login", data).then((r) => r.data),
    onSuccess: (data) => {
      setUser(data.user, data.accessToken);
      const from = searchParams.get("from") ?? "/dashboard";
      router.push(from);
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mutate({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
  };

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ??
      "Invalid email or password. Please try again."
    : null;

  console.log(errorMessage)

  return (
    <div className="min-h-screen w-full bg-[#0C0C0C] flex flex-col">


      <AuthNav prompt="No account?" linkLabel="Sign up" linkHref="/signup" />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">

         
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

            {/* Error */}
            {errorMessage && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
          
              <Input label="Email address" type="email" name="email" required placeholder="you@example.com" />
              <Input label="Password" type="password" name="password" required placeholder="••••••••" />

             
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
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

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/20">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Google — placeholder for OAuth */}
            <button
              type="button"
              className="w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-white/60 hover:text-white rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-white/25 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand hover:underline">
              Create one free
            </Link>
          </p>

          <p className="text-center text-[11px] text-white/15 mt-4 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default LoginPage