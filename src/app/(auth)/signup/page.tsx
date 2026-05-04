"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import Input from "@/components/ui/input";
import Image from "next/image";
import AuthNav from "@/components/ui/authnav";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: "creator" | "buyer";
}

interface SignupResponse {
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

const roles = [
  {
    id: "creator" as const,
    label: "I'm a Creator",
    description: "Sell products, protect your work, get paid in naira.",
  },
  {
    id: "buyer" as const,
    label: "I'm a Buyer",
    description: "Buy digital products from Nigerian creatives.",
  },
];

const SignupPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [role, setRole] = useState<"creator" | "buyer">("creator");

  const { mutate, isPending, isError, error } = useMutation({
    
    mutationFn: (data: SignupInput) =>
      api.post<SignupResponse>("/auth/signup", data).then((r) => r.data),
    onSuccess: (data) => {
     
      setUser(data.user, data.accessToken);
      router.push(data.user.role === "creator" ? "/dashboard" : "/library");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    mutate({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      role,
    });
  };

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ??
      "Something went wrong. Please try again."
    : null;

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col font-inter w-full">

     
      <AuthNav prompt="Have an account?" linkLabel="Sign in" linkHref="/login" />

    
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">

          {/* Eyebrow */}
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
            <Image
                src="/og-icon.svg"
                alt="o"
                width={40}
                height={40}
                priority
                className="w-[0.75em] h-[0.75em] relative top-[0.05em]"
            />
            ck
            </span>
            </span>
          </h1>
          <p className="text-sm text-white/30 text-center mb-7 font-inter">
            Turn what you know into what you earn.
          </p>

          {/* Card */}
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7">

           
            <div className="relative flex p-1 bg-white/3 rounded-xl border border-white/[0.06] mb-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className="relative flex-1 py-2 rounded-lg text-sm font-medium z-10 transition-colors duration-200"
                  style={{
                    color: role === r.id ? "#fff" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {role === r.id && (
                    <motion.div
                      layoutId="role-pill"
                      className="absolute inset-0 bg-brand rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{r.label}</span>
                </button>
              ))}
            </div>

           
            <div className="h-8 flex items-center justify-center mb-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={role}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs text-white/30 text-center font-inter leading-relaxed"
                >
                  {roles.find((r) => r.id === role)?.description}
                </motion.p>
              </AnimatePresence>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                type="text"
                name="name"
                required
                placeholder="Adaeze Okonkwo"
              />
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
                    Creating account...
                  </>
                ) : (
                  `Create ${role === "creator" ? "creator" : "buyer"} account`
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/25 mt-5 font-inter">
            Already have an account?{" "}
            <Link href="/login" className="text-brand hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-[11px] text-white/15 mt-3 leading-relaxed font-inter">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage