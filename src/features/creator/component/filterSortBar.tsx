"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowsDownUp } from "@phosphor-icons/react";
import type { FilterStatus, SortOption } from "../types/product.types";

// ─── Config ───────────────────────────────────────────────────────────────────

export const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all",         label: "All" },
  { value: "published",   label: "Published" },
  { value: "draft",       label: "Draft" },
  { value: "unpublished", label: "Unpublished" },
  { value: "flagged",     label: "Flagged" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest" },
  { value: "oldest",     label: "Oldest" },
  { value: "price_high", label: "Price (high → low)" },
  { value: "price_low",  label: "Price (low → high)" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface FilterSortBarProps {
  filter: FilterStatus;
  sort: SortOption;
  onFilterChange: (f: FilterStatus) => void;
  onSortChange: (s: SortOption) => void;
  counts: Record<FilterStatus, number>;
}

export default function FilterSortBar({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  counts,
}: FilterSortBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sort)!;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">

      {/* Filter pills */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = filter === opt.value;
          const count = counts[opt.value];
          return (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-inter font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? "bg-brand/10 border-brand/30 text-brand"
                  : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/15"
              }`}
            >
              {opt.label}
              <span
                className={`font-mono text-[10px] px-1 py-0.5 rounded-md ${
                  isActive ? "bg-brand/20 text-brand" : "bg-white/[0.05] text-white/25"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div ref={sortRef} className="relative w-fit">
        <button
          onClick={() => setSortOpen((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-inter font-medium transition-colors w-full sm:w-auto ${
            sortOpen
              ? "bg-brand/10 border-brand/30 text-brand"
              : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/15"
          }`}
        >
          <ArrowsDownUp size={12} weight="bold" />
          <span>{activeSort.label}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-auto transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {sortOpen && (
          <div className="absolute top-full right-24 left-20 mt-1.5 z-20 w-48 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {SORT_OPTIONS.map((opt) => {
              const isActive = sort === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onSortChange(opt.value); setSortOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-inter transition-colors ${
                    isActive
                      ? "text-brand bg-brand/10"
                      : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {opt.label}
                  {isActive && <CheckCircle size={13} weight="fill" className="text-brand" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}