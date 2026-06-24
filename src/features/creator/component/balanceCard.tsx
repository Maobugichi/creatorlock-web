import { formatNGN } from '@/lib/utils';
import type { BalanceResponse } from '../types/payout.types';
import { MINIMUM_PAYOUT_CENTS } from '../utils/payout.utils';

export function BalanceCard({ available, total_earned, total_paid_out }: BalanceResponse) {
  const hasPendingPayout = total_paid_out > 0 && available === 0;

  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest mb-1">Available balance</p>
        <p className="font-mono text-4xl font-bold text-white">{formatNGN(available)}</p>
        <p className="text-xs text-[var(--muted)] mt-2">
          <span className="font-mono">{formatNGN(total_earned)}</span> total earned
          {' · '}
          <span className="font-mono">{formatNGN(total_paid_out)}</span> paid out
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">After 7% platform fee</p>
      </div>

      {hasPendingPayout && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-blue-400">
          You have a payout in progress. Your balance will update once it&apos;s completed or rejected.
        </div>
      )}

      {available < MINIMUM_PAYOUT_CENTS && available > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-xs text-orange-400">
          Minimum withdrawal is {formatNGN(MINIMUM_PAYOUT_CENTS)}.{' '}
          You need {formatNGN(MINIMUM_PAYOUT_CENTS - available)} more to request a payout.
        </div>
      )}
    </div>
  );
}

export function BalanceCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 animate-pulse space-y-3">
      <div className="h-3 bg-white/10 rounded w-32" />
      <div className="h-10 bg-white/10 rounded w-48" />
      <div className="h-3 bg-white/5 rounded w-24" />
    </div>
  );
}