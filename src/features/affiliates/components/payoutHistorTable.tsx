'use client';

import { formatNGN } from '@/lib/utils';
import { useAffiliatePayouts } from '../api/useAffiliatePayouts';
import type { AffiliatePayout } from '../types/affiliate.types';
import { STATUS_STYLES } from '@/features/shared/utils/payout.utils';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PayoutStatusBadge({ status }: { status: AffiliatePayout['status'] }) {
  const style = STATUS_STYLES[status];
  return (
    <span className={`inline-block text-xs font-syne font-semibold px-2.5 py-1 rounded-lg border ${style.classes}`}>
      {style.label}
    </span>
  );
}

function PayoutRow({ payout }: { payout: AffiliatePayout }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0 hover:bg-elevated/50 transition-colors">
      <div className="min-w-0">
        <p className="text-surface-foreground text-sm font-mono">{formatNGN(payout.amount_cents)}</p>
        <p className="text-muted-foreground text-xs truncate">
          {payout.account_name ?? '—'} {payout.account_number ? `··${payout.account_number.slice(-4)}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-6 shrink-0 ml-4">
        <div className="hidden sm:block text-right">
          <p className="text-surface-foreground text-sm">{formatDate(payout.requested_at)}</p>
          <p className="text-muted-foreground text-xs">requested</p>
        </div>
        <PayoutStatusBadge status={payout.status} />
      </div>
    </div>
  );
}

function PayoutRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-elevated rounded w-24" />
        <div className="h-3 bg-elevated rounded w-32" />
      </div>
      <div className="flex items-center gap-6">
        <div className="h-3 bg-elevated rounded w-16" />
        <div className="h-6 bg-elevated rounded-lg w-20" />
      </div>
    </div>
  );
}

export function PayoutHistoryTable() {
  const { data: payouts, isLoading, isError } = useAffiliatePayouts();

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-surface-foreground font-syne font-bold text-base">Payout History</h2>
        {!isLoading && payouts && payouts.length > 0 && (
          <span className="text-muted-foreground text-xs font-mono">
            {payouts.length} payout{payouts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoading && [0, 1, 2].map((i) => <PayoutRowSkeleton key={i} />)}

      {isError && !isLoading && (
        <div className="px-5 py-10 text-center">
          <p className="text-status-exception text-sm">Failed to load payout history. Please refresh.</p>
        </div>
      )}

      {!isLoading && !isError && payouts && payouts.length === 0 && (
        <div className="px-5 py-14 text-center">
          <p className="text-surface-foreground font-syne font-bold text-base mb-1">No payouts yet</p>
          <p className="text-muted-foreground text-sm">
            Once you request a payout, it&apos;ll show up here.
          </p>
        </div>
      )}

      {!isLoading && !isError && payouts && payouts.length > 0 &&
        payouts.map((payout) => <PayoutRow key={payout.id} payout={payout} />)}
    </div>
  );
}