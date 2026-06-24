"use client";

import { motion } from "motion/react";
import { LibraryCard } from "@/components/library/LibraryCard";
import { useLibrary } from "@/features/buyer/api/useLibrary";
import LibraryCardSkeleton from "@/features/buyer/components/libraryCardSkeleton";
import LibraryEmpty from "@/features/buyer/components/libraryEmpty";
import LibraryError from "@/features/buyer/components/libraryError";

export default function LibraryPage() {
  const { data: items, isLoading, isError, refetch } = useLibrary();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 flex flex-col gap-1"
        >
          <h1 className="font-syne font-extrabold text-white text-2xl sm:text-3xl">
            My Library
          </h1>
          <p className="font-inter text-sm text-white/40">
            All your purchased products and active download links.
          </p>
        </motion.div>

        {/* ── Count badge ── */}
        {!isLoading && !isError && items && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-xs font-inter text-white/40 bg-white/[0.04] border border-[var(--border)] rounded-lg px-3 py-1.5">
              <svg
                className="w-3.5 h-3.5 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              {items.length} {items.length === 1 ? "purchase" : "purchases"}
            </span>
          </motion.div>
        )}

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <LibraryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {isError && <LibraryError onRetry={refetch} />}

        {/* ── Empty State ── */}
        {!isLoading && !isError && items && items.length === 0 && (
          <LibraryEmpty />
        )}

        {/* ── Populated Grid ── */}
        {!isLoading && !isError && items && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.order_id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: index * 0.06,
                }}
              >
                <LibraryCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}