"use client";

import { motion } from "motion/react";
import { sanitiseSlug } from "../utils/slug";
import type { ApiError } from "../types/auth.types";

interface OnboardingStepSlugProps {
  slug: string;
  slugError: string;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onChange: (slug: string) => void;
  onBack: () => void;
  onComplete: () => void;
}

export function OnboardingStepSlug({
  slug, slugError, isPending, isError, error,
  onChange, onBack, onComplete,
}: OnboardingStepSlugProps) {
  return (
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
              onChange={(e) => onChange(sanitiseSlug(e.target.value))}
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
            onClick={onBack}
            className="flex-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
          >
            Back
          </button>
          <button
            onClick={onComplete}
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
  );
}