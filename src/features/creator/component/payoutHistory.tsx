'use client';

import { motion } from 'motion/react';
import { formatNGN } from '@/lib/utils';
import { usePayoutHistory } from '../api/usePayoutHistory';
import { useBanks } from '@/features/shared/api/useBanks';
import { STATUS_STYLES } from '../utils/payout.utils';
import { SkeletonRow } from './payoutSkeletonRow';

export function PayoutHistory() {
  const { payouts, isLoading } = usePayoutHistory();
  const { banks } = useBanks();

  const resolveBankName = (code: string) =>
    banks.find((b) => b.code === code)?.name ?? code;

  return (
    <div className="space-y-4">
      <h2 className="font-syne font-bold text-lg">Payout history</h2>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {isLoading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}

        {!isLoading && payouts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-2">
            <p className="text-sm font-syne font-semibold text-surface-foreground">No payouts yet</p>
            <p className="text-sm text-muted-foreground">Your withdrawal history will appear here.</p>
          </div>
        )}

        {!isLoading && payouts.length > 0 && (
          <ul className="divide-y divide-border">
            {payouts.map((payout, index) => {
              const statusStyle = STATUS_STYLES[payout.status] ?? STATUS_STYLES.pending;
              const isPaidOut = payout.status === 'paid';
              return (
                <motion.li
                  key={payout.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-syne font-semibold text-surface-foreground">
                      {resolveBankName(payout.bank_code)}
                      <span className="font-mono font-normal text-muted-foreground ml-2 text-xs relative top-[0.5px]">
                        ···{payout.account_number.slice(-4)}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {payout.account_name}
                      {' · '}
                      {new Date(payout.requested_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {payout.failure_reason && payout.status === 'failed' && (
                      <p className="text-sm font-medium text-status-exception mt-1">{payout.failure_reason}</p>
                    )}
                    {payout.status === 'reversed' && (
                      <p className="text-sm font-medium text-status-warning mt-1">
                        Transfer was reversed — contact support if funds were deducted.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-semibold text-sm ${isPaidOut ? 'text-success' : 'text-surface-foreground'}`}>
                      {formatNGN(payout.amount_cents)}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.classes}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}