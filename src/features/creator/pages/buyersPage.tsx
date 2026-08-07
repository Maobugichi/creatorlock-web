'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useBuyers } from '../api/useBuyer';
import { SummaryCards } from '../component/buyerSummaryCards';
import { BuyerRowItem } from '../component/buyerRow';
import { ExportButton } from '../component/exportButton';
import { SummaryCardSkeleton, BuyerRowSkeleton } from '../component/buyerSkeleton';
import { BuyerEmailDrawer } from '../component/buyerEmailDrawer';
import { MagnifyingGlass, X, FunnelSimple } from '@phosphor-icons/react';
import type { BuyerRow } from '../types/buyer.types';

type SpendFilter = 'all' | 'under_5k' | '5k_to_50k' | 'over_50k';
type OrderFilter = 'all' | 'one' | 'two_to_five' | 'over_five';

interface Filters {
  spend: SpendFilter;
  orders: OrderFilter;
}

const SPEND_OPTIONS: { value: SpendFilter; label: string }[] = [
  { value: 'all',        label: 'Any spend'   },
  { value: 'under_5k',  label: 'Under ₦5k'   },
  { value: '5k_to_50k', label: '₦5k – ₦50k'  },
  { value: 'over_50k',  label: 'Over ₦50k'   },
];

const ORDER_OPTIONS: { value: OrderFilter; label: string }[] = [
  { value: 'all',         label: 'Any orders' },
  { value: 'one',         label: '1 order'    },
  { value: 'two_to_five', label: '2 – 5'      },
  { value: 'over_five',   label: '6+'         },
];

const DEFAULT_FILTERS: Filters = { spend: 'all', orders: 'all' };

function applyFilters(buyers: BuyerRow[], search: string, filters: Filters): BuyerRow[] {
  const q = search.trim().toLowerCase();

  return buyers.filter((b) => {
    if (q && !b.name.toLowerCase().includes(q) && !b.email.toLowerCase().includes(q)) {
      return false;
    }

    const spent = parseInt(b.total_spent_cents, 10);
    if (filters.spend === 'under_5k'  && spent >= 500_000)                        return false;
    if (filters.spend === '5k_to_50k' && (spent < 500_000 || spent >= 5_000_000)) return false;
    if (filters.spend === 'over_50k'  && spent < 5_000_000)                       return false;

    const orders = parseInt(b.total_purchases, 10);
    if (filters.orders === 'one'         && orders !== 1)         return false;
    if (filters.orders === 'two_to_five' && (orders < 2 || orders > 5)) return false;
    if (filters.orders === 'over_five'   && orders <= 5)          return false;

    return true;
  });
}

export default function BuyersPage() {
  const { buyers, isLoading, isError } = useBuyers();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen]   = useState(false);

  const [search, setSearch]           = useState('');
  const [filters, setFilters]         = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef                     = useRef<HTMLInputElement>(null);

  const filteredBuyers = useMemo(
    () => applyFilters(buyers, search, filters),
    [buyers, search, filters],
  );

  const activeFilterCount =
    (filters.spend  !== 'all' ? 1 : 0) +
    (filters.orders !== 'all' ? 1 : 0);

  const hasActiveSearch = search.trim().length > 0 || activeFilterCount > 0;

  const selectedBuyers: BuyerRow[] = useMemo(
    () => buyers.filter((b) => selectedIds.has(b.buyer_id)),
    [buyers, selectedIds],
  );

  const allVisibleSelected =
    filteredBuyers.length > 0 &&
    filteredBuyers.every((b) => selectedIds.has(b.buyer_id));

  const someVisibleSelected = filteredBuyers.some((b) => selectedIds.has(b.buyer_id));
  const someSelected        = selectedIds.size > 0;

  const toggleBuyer = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        filteredBuyers.forEach((b) => next.delete(b.buyer_id));
      } else {
        filteredBuyers.forEach((b) => next.add(b.buyer_id));
      }
      return next;
    });
  }, [allVisibleSelected, filteredBuyers]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);
  const handleSendSuccess = useCallback(() => {
    clearSelection();
    setDrawerOpen(false);
  }, [clearSelection]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
  }, []);

  return (
    <>
      <div className="space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-surface-foreground font-syne font-extrabold text-2xl">Buyers</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Everyone who has purchased your products.
            </p>
          </div>
          {!isLoading && buyers.length > 0 && (
            <div className={`transition-opacity duration-200 ${someSelected ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <ExportButton />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <SummaryCardSkeleton key={i} />)}
          </div>
        ) : !isError && buyers.length > 0 ? (
          <SummaryCards buyers={buyers} />
        ) : null}

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-surface-foreground font-syne font-bold text-base">Buyer List</h2>
            {!isLoading && buyers.length > 0 && (
              <span className="text-muted-foreground text-xs font-mono">
                {buyers.length.toLocaleString()} buyer{buyers.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {!isLoading && (buyers.length > 0 || hasActiveSearch) && (
            <div className="px-5 py-3 border-b border-border space-y-3">
              <div className="flex items-center gap-2">

                <div className="relative flex-1">
                  <MagnifyingGlass
                    weight="regular"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    className="w-full bg-elevated border border-border rounded-xl pl-9 pr-9 py-2.5 text-surface-foreground text-sm focus:border-primary/60 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-surface-foreground transition-colors"
                      aria-label="Clear search"
                    >
                      <X weight="bold" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    filtersOpen || activeFilterCount > 0
                      ? 'border-primary/50 bg-primary/[0.07] text-surface-foreground'
                      : 'border-border bg-elevated text-muted-foreground hover:text-surface-foreground hover:border-primary/25'
                  }`}
                  aria-expanded={filtersOpen}
                >
                  <FunnelSimple weight="regular" className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {filtersOpen && (
                <div className="flex flex-wrap gap-4 pt-1 pb-0.5">

                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Spend</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SPEND_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, spend: opt.value }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            filters.spend === opt.value
                              ? 'border-primary/50 bg-primary/[0.1] text-surface-foreground'
                              : 'border-border bg-elevated text-muted-foreground hover:text-surface-foreground hover:border-primary/25'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Orders</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ORDER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, orders: opt.value }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            filters.orders === opt.value
                              ? 'border-primary/50 bg-primary/[0.1] text-surface-foreground'
                              : 'border-border bg-elevated text-muted-foreground hover:text-surface-foreground hover:border-primary/25'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <div className="flex items-end pb-0.5">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-muted-foreground hover:text-surface-foreground text-xs transition-colors underline underline-offset-2"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!isLoading && buyers.length > 0 && (
            <div className="hidden sm:flex items-center px-5 py-2 border-b border-border bg-elevated/50">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleAllVisible}
                ref={(el) => {
                  if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
                }}
                className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer mr-4 shrink-0"
                aria-label="Select all visible buyers"
              />
              <span className="text-muted-foreground text-xs uppercase tracking-wider flex-1">
                Buyer
              </span>
              <div className="flex items-center gap-6 shrink-0 ml-4">
                {['Orders', 'Spent', 'Last Order'].map((col) => (
                  <span
                    key={col}
                    className="text-muted-foreground text-xs uppercase tracking-wider w-20 text-right"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isLoading && [0, 1, 2, 3, 4].map((i) => <BuyerRowSkeleton key={i} />)}

          {isError && !isLoading && (
            <div className="px-5 py-10 text-center">
              <p className="text-status-exception text-sm">Failed to load buyers. Please refresh.</p>
            </div>
          )}

          {!isLoading && !isError && buyers.length === 0 && (
            <div className="px-5 py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-surface-foreground font-syne font-bold text-base mb-1">No buyers yet</p>
              <p className="text-muted-foreground text-sm">
                Buyers will appear here once someone purchases one of your products.
              </p>
            </div>
          )}

          {!isLoading && !isError && buyers.length > 0 && hasActiveSearch && filteredBuyers.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-surface-foreground font-syne font-bold text-sm mb-1">No results</p>
              <p className="text-muted-foreground text-xs mb-4">
                No buyers match your current search or filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="text-primary hover:text-primary/80 text-xs transition-colors underline underline-offset-2"
              >
                Clear search and filters
              </button>
            </div>
          )}

          {!isLoading && !isError && filteredBuyers.length > 0 &&
            filteredBuyers.map((buyer) => (
              <BuyerRowItem
                key={buyer.buyer_id}
                buyer={buyer}
                selected={selectedIds.has(buyer.buyer_id)}
                onSelect={() => toggleBuyer(buyer.buyer_id)}
              />
            ))
          }
        </div>


       <div className="h-20" aria-hidden/>
      </div>


      <div
        className={`fixed bottom-0 left-0 right-0 z-30 flex justify-center px-4 pb-5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          someSelected
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 bg-elevated border border-border rounded-2xl px-4 py-3 shadow-2xl shadow-black/60 w-full max-w-md">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-bold font-mono flex items-center justify-center shrink-0">
              {selectedIds.size}
            </span>
            <span className="text-surface-foreground text-xs font-medium truncate">
              buyer{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="text-muted-foreground hover:text-surface-foreground text-xs transition-colors shrink-0 underline underline-offset-2"
            >
              Clear
            </button>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl px-4 py-2 text-sm transition-all shrink-0"
          >
            ✉️ Send email
          </button>
        </div>
      </div>

      <BuyerEmailDrawer
        open={drawerOpen}
        buyers={selectedBuyers}
        onClose={handleDrawerClose}
        onSendSuccess={handleSendSuccess}
      />
    </>
  );
}