'use client';

import { formatNGN } from '@/lib/utils';
import { useAffiliateStats } from '../api/useAffiliateStats';
import type { AffiliateStatsRow } from '../types/affiliate.types';

function CreatorRow({ row }: { row: AffiliateStatsRow }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-white/[0.015] transition-colors">
      <div className="min-w-0">
        <p className="text-white text-sm font-medium truncate">{row.creator_name}</p>
        <p className="text-[var(--muted)] text-xs">{row.commission_percent}% commission</p>
      </div>

      <div className="flex items-center gap-6 shrink-0 ml-4">
        <div className="text-right">
          <p className="text-white text-sm font-mono">{row.total_conversions}</p>
          <p className="text-[var(--muted)] text-xs">conversions</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-mono">{formatNGN(row.total_earned_cents)}</p>
          <p className="text-[var(--muted)] text-xs">earned</p>
        </div>
        <span
          className={`text-xs font-syne font-semibold px-2.5 py-1 rounded-lg border ${
            row.active
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-white/[0.04] text-[var(--muted)] border-[var(--border)]'
          }`}
        >
          {row.active ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
}

function CreatorRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-white/[0.06] rounded w-28" />
        <div className="h-3 bg-white/[0.04] rounded w-20" />
      </div>
      <div className="flex items-center gap-6">
        <div className="h-3 bg-white/[0.04] rounded w-14" />
        <div className="h-3 bg-white/[0.04] rounded w-16" />
        <div className="h-6 bg-white/[0.06] rounded-lg w-16" />
      </div>
    </div>
  );
}

export function CreatorBreakdown() {
  const { data: stats, isLoading, isError } = useAffiliateStats();
  const rows = stats?.affiliates ?? [];

  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h2 className="text-white font-syne font-bold text-base">Creators You Promote</h2>
        {!isLoading && rows.length > 0 && (
          <span className="text-[var(--muted)] text-xs font-mono">
            {rows.length} creator{rows.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoading && [0, 1, 2].map((i) => <CreatorRowSkeleton key={i} />)}

      {isError && !isLoading && (
        <div className="px-5 py-10 text-center">
          <p className="text-red-400 text-sm">Failed to load your creators. Please refresh.</p>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="px-5 py-14 text-center">
          <p className="text-white font-syne font-bold text-base mb-1">No affiliate links yet</p>
          <p className="text-[var(--muted)] text-sm">
            Once a creator adds you as an affiliate, they&apos;ll show up here.
          </p>
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 &&
        rows.map((row) => <CreatorRow key={row.id} row={row} />)}
    </div>
  );
}