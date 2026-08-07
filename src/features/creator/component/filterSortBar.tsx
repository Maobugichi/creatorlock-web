"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowsDownUp } from "@phosphor-icons/react";
import type { FilterStatus, SortOption } from "../types/product.types";

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
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-elevated border-border text-muted-foreground hover:text-surface-foreground hover:border-border-strong"
              }`}
            >
              {opt.label}
              <span
                className={`font-mono text-[10px] px-1 py-0.5 rounded-md ${
                  isActive ? "bg-primary/20 text-primary" : "bg-elevated text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div ref={sortRef} className="relative w-fit">
        <button
          onClick={() => setSortOpen((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-inter font-medium transition-colors w-full sm:w-auto ${
            sortOpen
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-elevated border-border text-muted-foreground hover:text-surface-foreground hover:border-border-strong"
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
          <div className="absolute top-full right-24 left-20 mt-1.5 z-20 w-48 bg-elevated border border-border rounded-xl overflow-hidden shadow-xl">
            {SORT_OPTIONS.map((opt) => {
              const isActive = sort === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onSortChange(opt.value); setSortOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-inter transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-surface-foreground hover:bg-border-strong"
                  }`}
                >
                  {opt.label}
                  {isActive && <CheckCircle size={13} weight="fill" className="text-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}