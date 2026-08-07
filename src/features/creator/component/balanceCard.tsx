'use client';

import { useEffect, useState } from 'react';
import { animate } from 'motion';
import { formatNGN } from '@/lib/utils';
import type { BalanceResponse } from '../types/payout.types';
import { MINIMUM_PAYOUT_CENTS } from '../utils/payout.utils';

function useCountUp(target: number, durationSeconds = 0.9) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: durationSeconds,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [target, durationSeconds]);

  return value;
}

export function BalanceCard({ available, total_earned, total_paid_out }: BalanceResponse) {
  const hasPendingPayout = total_paid_out > 0 && available === 0;
  const belowMinimum = available < MINIMUM_PAYOUT_CENTS && available > 0;
  const animatedAvailable = useCountUp(available);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Available balance</p>
        <p className="font-mono text-3xl sm:text-4xl font-bold text-success truncate">
          {formatNGN(Math.round(animatedAvailable))}
        </p>
        <p className="text-xs text-muted-foreground">After 7% platform fee</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border border-t border-border pt-5">
        <div className="pr-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Total earned</p>
          <p className="text-lg font-semibold text-surface-foreground truncate">{formatNGN(total_earned)}</p>
        </div>
        <div className="pl-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Paid out</p>
          <p className="text-lg font-semibold text-success truncate">{formatNGN(total_paid_out)}</p>
        </div>
      </div>

      {hasPendingPayout && (
        <div className="rounded-2xl border border-status-progress/20 bg-status-progress/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-status-progress">Payout in progress</p>
          <p className="text-sm text-status-progress/70 mt-0.5">
            Your balance will update once it&apos;s completed or rejected.
          </p>
        </div>
      )}

      {belowMinimum && (
        <div className="rounded-2xl border border-status-warning/20 bg-status-warning/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-status-warning">Below minimum withdrawal</p>
          <p className="text-sm text-status-warning/70 mt-0.5">
            You need {formatNGN(MINIMUM_PAYOUT_CENTS - available)} more to reach the{' '}
            {formatNGN(MINIMUM_PAYOUT_CENTS)} minimum.
          </p>
        </div>
      )}
    </div>
  );
}

export function BalanceCardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 bg-elevated rounded w-28" />
        <div className="h-10 bg-elevated rounded w-52" />
        <div className="h-3 bg-elevated rounded w-24" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-border border-t border-border pt-5">
        <div className="pr-4 space-y-2">
          <div className="h-3 bg-elevated rounded w-20" />
          <div className="h-5 bg-elevated rounded w-24" />
        </div>
        <div className="pl-4 space-y-2">
          <div className="h-3 bg-elevated rounded w-20" />
          <div className="h-5 bg-elevated rounded w-24" />
        </div>
      </div>
    </div>
  );
}