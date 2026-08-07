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
      <h1 className="font-syne font-extrabold text-2xl text-surface-foreground text-center mb-1">
        Claim your store URL
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-7">
        This is your public storefront link.
      </p>
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-7 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block font-inter">
            Store URL
          </label>
          <div className="flex items-center bg-elevated border border-border rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
            <span className="px-3 py-3 text-sm text-muted-foreground border-r border-border whitespace-nowrap font-inter">
              creatorlock.co/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => onChange(sanitiseSlug(e.target.value))}
              placeholder="your-store"
              className="flex-1 bg-transparent px-3 py-3 text-sm text-surface-foreground placeholder:text-muted-foreground outline-none font-inter"
            />
          </div>
          {slugError && (
            <p className="text-xs text-status-exception mt-1.5">{slugError}</p>
          )}
        </div>

        {isError && (
          <p className="text-xs text-status-exception">
            {(error as ApiError)?.response?.data?.message ?? "Something went wrong."}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border border-border hover:border-border-strong text-muted-foreground hover:text-surface-foreground font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
          >
            Back
          </button>
          <button
            onClick={onComplete}
            disabled={!slug.trim() || isPending}
            className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-primary-foreground font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
          >
            {isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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