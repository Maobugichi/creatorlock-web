"use client";

import { motion } from "motion/react";

export default function LibraryEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface border border-[var(--border)] flex items-center justify-center">
        <svg
          className="w-7 h-7 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h2 className="font-syne font-bold text-white text-lg">
          Your library is empty
        </h2>
        <p className="font-inter text-sm text-white/40 leading-relaxed">
          Purchases you complete will appear here with download links and
          access details.
        </p>
      </div>
    </motion.div>
  );
}