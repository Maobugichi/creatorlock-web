// app/(auth)/onboarding/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { RoleSelector } from "../signup/_component/role-selector";
import Input from "@/components/ui/input";
import api from "@/lib/api";
import type { ApiError, Role } from "../signup/types";

type Step = "role" | "profile" | "slug";

export default function OnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>("creator");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { role: Role; name: string; storeSlug?: string }) =>
      api.post("/auth/onboarding", data).then((r) => r.data),
    onSuccess: (data) => {
      setUser(data.user);
      router.push(data.user.role === "creator" ? "/dashboard" : "/discover");
    },
  });

  const handleNameNext = () => {
    if (!name.trim()) return;
    if (role === "creator") {
      // Auto-generate slug from name as a starting point
      setSlug(
        name.toLowerCase().trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
      setStep("slug");
    } else {
      mutate({ role, name });
    }
  };

  const handleComplete = () => {
    if (!slug.trim()) return;
    mutate({ role, name, storeSlug: slug });
  };

  const steps: Step[] = role === "creator"
    ? ["role", "profile", "slug"]
    : ["role", "profile"];

  const stepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4 font-inter">
      <div className="w-full max-w-md">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              animate={{
                width: i === stepIndex ? 20 : 6,
                opacity: i <= stepIndex ? 1 : 0.2,
              }}
              className="h-1.5 rounded-full bg-brand"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1 — Role */}
          {step === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-syne font-extrabold text-2xl text-white text-center mb-1">
                How will you use CreatorLock?
              </h1>
              <p className="text-sm text-white/30 text-center mb-7">
                You can always change this later.
              </p>
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7">
                <RoleSelector value={role} onChange={setRole} />
                <button
                  onClick={() => setStep("profile")}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Name */}
          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-syne font-extrabold text-2xl text-white text-center mb-1">
                What should we call you?
              </h1>
              <p className="text-sm text-white/30 text-center mb-7">
                {role === "creator"
                  ? "This is your public display name on your store."
                  : "This is how other people will see you."}
              </p>
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7 space-y-4">
                <Input
                  label={role === "creator" ? "Display name" : "Full name"}
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "creator" ? "Adaeze Creates" : "Adaeze Okonkwo"}
                  required
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("role")}
                    className="flex-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNameNext}
                    disabled={!name.trim() || isPending}
                    className="flex-1 bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
                  >
                    {isPending && role === "buyer" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finishing...
                      </>
                    ) : (
                      role === "creator" ? "Continue" : "Finish"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Store slug (creators only) */}
          {step === "slug" && (
            <motion.div
              key="slug"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-syne font-extrabold text-2xl text-white text-center mb-1">
                Claim your store URL
              </h1>
              <p className="text-sm text-white/30 text-center mb-7">
                This is your public storefront link.
              </p>
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7 space-y-4">
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block font-inter">
                    Store URL
                  </label>
                  <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-brand/50 transition-colors">
                    <span className="px-3 py-3 text-sm text-white/20 border-r border-white/[0.08] whitespace-nowrap font-inter">
                      creatorlock.co/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        const val = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "")
                          .replace(/--+/g, "-");
                        setSlug(val);
                        setSlugError("");
                      }}
                      placeholder="your-store"
                      className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/20 outline-none font-inter"
                    />
                  </div>
                  {slugError && (
                    <p className="text-xs text-red-400 mt-1.5">{slugError}</p>
                  )}
                </div>

                {isError && (
                  <p className="text-xs text-red-400">
                    {(error as ApiError)?.response?.data?.message ?? "Something went wrong."}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("profile")}
                    className="flex-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!slug.trim() || isPending}
                    className="flex-1 bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
                  >
                    {isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      "Launch my store"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}