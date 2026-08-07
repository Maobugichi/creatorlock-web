'use client';

import { formatNGN } from '@/lib/utils';
import { useAffiliateStats } from '../api/useAffiliateStats';
import type { AffiliateStatsRow } from '../types/affiliate.types';

function CreatorRow({ row }: { row: AffiliateStatsRow }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0 hover:bg-elevated/50 transition-colors">
      <div className="min-w-0">
        <p className="text-surface-foreground text-sm font-medium truncate">{row.creator_name}</p>
        <p className="text-muted-foreground text-xs">{row.commission_percent}% commission</p>
      </div>

      <div className="flex items-center gap-6 shrink-0 ml-4">
        <div className="text-right">
          <p className="text-surface-foreground text-sm font-mono">{row.total_conversions}</p>
          <p className="text-muted-foreground text-xs">conversions</p>
        </div>
        <div className="text-right">
          <p className="text-surface-foreground text-sm font-mono">{formatNGN(row.total_earned_cents)}</p>
          <p className="text-muted-foreground text-xs">earned</p>
        </div>
        <span
          className={`text-xs font-syne font-semibold px-2.5 py-1 rounded-lg border ${
            row.active
              ? 'bg-status-positive/10 text-status-positive border-status-positive/20'
              : 'bg-elevated text-muted-foreground border-border'
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
    <div className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-elevated rounded w-28" />
        <div className="h-3 bg-elevated rounded w-20" />
      </div>
      <div className="flex items-center gap-6">
        <div className="h-3 bg-elevated rounded w-14" />
        <div className="h-3 bg-elevated rounded w-16" />
        <div className="h-6 bg-elevated rounded-lg w-16" />
      </div>
    </div>
  );
}

export function CreatorBreakdown() {
  const { data: stats, isLoading, isError } = useAffiliateStats();
  const rows = stats?.affiliates ?? [];

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-surface-foreground font-syne font-bold text-base">Creators You Promote</h2>
        {!isLoading && rows.length > 0 && (
          <span className="text-muted-foreground text-xs font-mono">
            {rows.length} creator{rows.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoading && [0, 1, 2].map((i) => <CreatorRowSkeleton key={i} />)}

      {isError && !isLoading && (
        <div className="px-5 py-10 text-center">
          <p className="text-status-exception text-sm">Failed to load your creators. Please refresh.</p>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="px-5 py-14 text-center">
          <p className="text-surface-foreground font-syne font-bold text-base mb-1">No affiliate links yet</p>
          <p className="text-muted-foreground text-sm">
            Once a creator adds you as an affiliate, they&apos;ll show up here.
          </p>
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 &&
        rows.map((row) => <CreatorRow key={row.id} row={row} />)}
    </div>
  );
}