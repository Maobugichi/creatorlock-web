"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import api from "@/lib/api";
import { LibraryCard } from "@/components/library/LibraryCard";
import type { GetBuyerLibraryResponse, LibraryItem } from "@/types/library.types";

// ─── Fetcher ─────────────────────────────────────────────────────────────────

const fetchLibrary = async (): Promise<LibraryItem[]> => {
  const res = await api.get<GetBuyerLibraryResponse>("/buyer/library");
  return res.data.data;
};

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function LibraryCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-5 flex flex-col gap-5">
      {/* Identity row */}
      <div className="flex gap-4 items-start">
        <div className="shrink-0 w-16 h-16 rounded-xl bg-white/[0.03] animate-pulse" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-4 w-3/4 rounded-lg bg-white/[0.03] animate-pulse" />
          <div className="h-3 w-1/2 rounded-lg bg-white/[0.03] animate-pulse" />
          <div className="h-5 w-16 rounded-lg bg-white/[0.03] animate-pulse mt-1" />
        </div>
      </div>
      {/* Financial grid */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-2.5 w-16 rounded bg-white/[0.03] animate-pulse" />
            <div className="h-4 w-24 rounded bg-white/[0.03] animate-pulse" />
          </div>
        ))}
      </div>
      {/* Meter */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <div className="h-2.5 w-20 rounded bg-white/[0.03] animate-pulse" />
          <div className="h-2.5 w-10 rounded bg-white/[0.03] animate-pulse" />
        </div>
        <div className="h-1 w-full rounded-full bg-white/[0.03] animate-pulse" />
      </div>
      {/* Divider */}
      <div className="h-px w-full bg-white/[0.04]" />
      {/* Button */}
      <div className="h-10 w-full rounded-xl bg-white/[0.03] animate-pulse" />
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyLibrary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      {/* Icon */}
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

// ─── Error State ─────────────────────────────────────────────────────────────

function LibraryError({ onRetry }: { onRetry: () => void }) {
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const {
    data: items,
    isLoading,
    isError,
    refetch,
  } = useQuery<LibraryItem[], Error>({
    queryKey: ["buyer", "library"],
    queryFn: fetchLibrary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });

  
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

        {/* ── Count badge (only when data is loaded and non-empty) ── */}
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
          <EmptyLibrary />
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