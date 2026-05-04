'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BuyerRow {
  buyer_id: string;
  name: string;
  email: string;
  total_purchases: number;
  total_spent_cents: number;
  last_purchase_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNGN = (cents: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(cents / 100);

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function extractBuyers(d: unknown): BuyerRow[] {
  if (Array.isArray(d)) return d;
  if (d && typeof d === 'object') {
    const obj = d as Record<string, unknown>;
    if (Array.isArray(obj.buyers)) return obj.buyers as BuyerRow[];
    if (Array.isArray(obj.data)) return obj.data as BuyerRow[];
  }
  return [];
}

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────

function SummaryCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-5 space-y-3">
      <div className="h-3.5 w-28 bg-white/[0.03] rounded-xl animate-pulse" />
      <div className="h-8 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
    </div>
  );
}

function BuyerRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/[0.03] animate-pulse shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-3.5 w-36 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-3 w-52 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="h-3.5 w-8 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3.5 w-24 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3.5 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ buyers }: { buyers: BuyerRow[] }) {
  const totalSpent = buyers.reduce((sum, b) => sum + b.total_spent_cents, 0);
  const totalOrders = buyers.reduce((sum, b) => sum + b.total_purchases, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2">
          Total Buyers
        </p>
        <p className="text-white font-syne font-extrabold text-2xl font-mono">
          {buyers.length.toLocaleString()}
        </p>
      </div>
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2">
          Total Orders
        </p>
        <p className="text-white font-syne font-extrabold text-2xl font-mono">
          {totalOrders.toLocaleString()}
        </p>
      </div>
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2">
          Total Revenue
        </p>
        <p className="text-white font-syne font-extrabold text-2xl font-mono">
          {formatNGN(totalSpent)}
        </p>
      </div>
    </div>
  );
}

// ─── Buyer Row ────────────────────────────────────────────────────────────────

function BuyerRowItem({ buyer }: { buyer: BuyerRow }) {
  const initials = buyer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-white/[0.015] transition-colors">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
          <span className="text-brand text-xs font-syne font-bold">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{buyer.name}</p>
          <p className="text-[var(--muted)] text-xs truncate">{buyer.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="text-right">
          <p className="text-white text-sm font-mono">{buyer.total_purchases}</p>
          <p className="text-[var(--muted)] text-xs">orders</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-mono">{formatNGN(buyer.total_spent_cents)}</p>
          <p className="text-[var(--muted)] text-xs">spent</p>
        </div>
        <div className="text-right">
          <p className="text-[var(--muted)] text-xs font-mono">{formatDate(buyer.last_purchase_at)}</p>
          <p className="text-[var(--muted)] text-xs">last order</p>
        </div>
      </div>
    </div>
  );
}

// ─── Export Button ────────────────────────────────────────────────────────────

function ExportButton() {
  function handleExport() {
    // Opens the export URL — browser handles the CSV download via Content-Disposition header
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    window.open(`${baseUrl}/creator/buyers/export`, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.98] border border-[var(--border)] text-white font-syne font-semibold rounded-xl px-4 py-2.5 text-sm transition-all"
    >
      <svg
        className="w-4 h-4 text-[var(--muted)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      Export CSV
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyersPage() {
  const {
    data: raw,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['buyers'],
    queryFn: () => api.get('/creator/buyers').then((res) => res.data),
  });

  const buyers = extractBuyers(raw);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-syne font-extrabold text-2xl">Buyers</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Everyone who has purchased your products.
          </p>
        </div>
        {!isLoading && buyers.length > 0 && <ExportButton />}
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SummaryCardSkeleton key={i} />)}
        </div>
      ) : !isError && buyers.length > 0 ? (
        <SummaryCard buyers={buyers} />
      ) : null}

      {/* Buyer List */}
      <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
        {/* List Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-white font-syne font-bold text-base">Buyer List</h2>
          {!isLoading && buyers.length > 0 && (
            <span className="text-[var(--muted)] text-xs font-mono">
              {buyers.length.toLocaleString()} buyer{buyers.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Column Headers (desktop) */}
        {!isLoading && buyers.length > 0 && (
          <div className="hidden sm:flex items-center justify-between px-5 py-2 border-b border-[var(--border)] bg-white/[0.01]">
            <span className="text-[var(--muted)] text-xs uppercase tracking-wider flex-1">
              Buyer
            </span>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-12 text-right">
                Orders
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-24 text-right">
                Spent
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-20 text-right">
                Last Order
              </span>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && [0, 1, 2, 3, 4].map((i) => <BuyerRowSkeleton key={i} />)}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="px-5 py-10 text-center">
            <p className="text-red-400 text-sm">Failed to load buyers. Please refresh.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && buyers.length === 0 && (
          <div className="px-5 py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <p className="text-white font-syne font-bold text-base mb-1">No buyers yet</p>
            <p className="text-[var(--muted)] text-sm">
              Buyers will appear here once someone purchases one of your products.
            </p>
          </div>
        )}

        {/* Buyer Rows */}
        {!isLoading &&
          !isError &&
          buyers.length > 0 &&
          buyers.map((buyer) => (
            <BuyerRowItem key={buyer.buyer_id} buyer={buyer} />
          ))}
      </div>
    </div>
  );
}