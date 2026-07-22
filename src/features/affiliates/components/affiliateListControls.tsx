'use client';

import { useEffect, useRef, useState } from 'react';

export type StatusFilter = 'all' | 'active' | 'inactive';
export type SortOption = 'newest' | 'oldest' | 'earned' | 'conversions';

interface AffiliateListControlsProps {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'earned', label: 'Highest Earned' },
  { value: 'conversions', label: 'Most Conversions' },
];

// Small sibling to SearchableDropdown — same trigger/panel visual language,
// no search input, for short option lists where search would be dead weight.
function SortDropdown({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = SORT_OPTIONS.find((o) => o.value === value)!;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors"
      >
        <span className="whitespace-nowrap">{selected.label}</span>
        <svg
          className={`w-4 h-4 text-[var(--muted)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-44 bg-surface border border-[var(--border)] rounded-xl overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.06] ${
                opt.value === value ? 'text-brand' : 'text-white'
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AffiliateListControls({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: AffiliateListControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-sm">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-brand/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center bg-white/[0.03] border border-[var(--border)] rounded-xl p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusFilterChange(opt.value)}
              className={`text-xs font-syne font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === opt.value
                  ? 'bg-brand/15 text-brand'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <SortDropdown value={sortBy} onChange={onSortByChange} />
      </div>
    </div>
  );
}