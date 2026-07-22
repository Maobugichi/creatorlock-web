'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  label?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No results found.',
  disabled = false,
  label,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // slight delay avoids the mobile keyboard fighting the open animation
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open]);

  function selectOption(option: DropdownOption) {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const option = filtered[highlightedIndex];
      if (option) selectOption(option);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-xs text-[var(--muted)] uppercase tracking-widest block mb-1.5">{label}</label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setHighlightedIndex(0);
          setOpen((v) => !v);
        }}
        className="w-full flex items-center justify-between gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-left focus:outline-none focus:border-brand/50 transition-colors disabled:opacity-50"
      >
        <span className={selected ? 'text-white truncate' : 'text-[var(--muted)] truncate'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[var(--muted)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full bg-surface border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="relative border-b border-[var(--border)]">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder:text-[var(--muted)] focus:outline-none"
            />
          </div>

          <ul ref={listRef} className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-[var(--muted)]">{emptyMessage}</li>
            )}
            {filtered.map((option, i) => {
              const isSelected = option.value === value;
              const isHighlighted = i === highlightedIndex;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                    className={`w-full flex items-center justify-between gap-2 text-left px-4 py-3 text-sm transition-colors ${
                      isHighlighted ? 'bg-white/[0.06]' : ''
                    } ${isSelected ? 'text-brand' : 'text-white'}`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}