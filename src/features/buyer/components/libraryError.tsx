"use client";

import { motion } from "motion/react";

interface LibraryErrorProps {
  onRetry: () => void;
}

export default function LibraryError({ onRetry }: LibraryErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface border border-red-500/20 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-red-400/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h2 className="font-syne font-bold text-white text-lg">
          Failed to load library
        </h2>
        <p className="font-inter text-sm text-white/40 leading-relaxed">
          Something went wrong fetching your purchases. Check your connection
          and try again.
        </p>
      </div>

      <button
        onClick={onRetry}
        className="bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl px-6 py-2.5 transition-all text-sm"
      >
        Try again
      </button>
    </motion.div>
  );
}