'use client';

import { useState } from 'react';
import {
  useAdminAffiliatePayouts,
  useApproveAffiliatePayout,
  useProcessAffiliatePayout,
} from '../api/useAdminAffiliatePayouts';
import { PayoutQueueRow, PayoutQueueRowSkeleton } from './PayoutQueueRow';
import { PayoutStatusFilter, type PayoutStatusFilterValue } from './PayoutStatusFilter';

export function AffiliatePayoutsTab() {
  const [statusFilter, setStatusFilter] = useState<PayoutStatusFilterValue>('all');
  const { data: payouts, isLoading, isError } = useAdminAffiliatePayouts(
    statusFilter === 'all' ? undefined : statusFilter
  );
  const { approve, isPending: isApproving, error: approveError } = useApproveAffiliatePayout();
  const { process, isPending: isProcessing, error: processError } = useProcessAffiliatePayout();

  const [actioningId, setActioningId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <PayoutStatusFilter value={statusFilter} onChange={setStatusFilter} />

      <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
        {isLoading && [0, 1, 2].map((i) => <PayoutQueueRowSkeleton key={i} />)}

        {isError && !isLoading && (
          <div className="px-5 py-10 text-center">
            <p className="text-red-400 text-sm">Failed to load payouts. Please refresh.</p>
          </div>
        )}

        {!isLoading && !isError && payouts && payouts.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-white font-syne font-bold text-base mb-1">No payouts</p>
            <p className="text-[var(--muted)] text-sm">Nothing matches this filter right now.</p>
          </div>
        )}

        {!isLoading && !isError && payouts?.map((payout) => (
          <PayoutQueueRow
            key={payout.id}
            recipientName={payout.affiliate_name}
            recipientSub={payout.affiliate_email}
            amountCents={payout.amount_cents}
            status={payout.status}
            requestedAt={payout.requested_at}
            failureReason={payout.failure_reason}
            canApprove={payout.status === 'pending'}
            canProcess={payout.status === 'approved'}
            onApprove={() => { setActioningId(payout.id); approve(payout.id); }}
            onProcess={() => { setActioningId(payout.id); process(payout.id); }}
            isApproving={isApproving && actioningId === payout.id}
            isProcessing={isProcessing && actioningId === payout.id}
            actionError={actioningId === payout.id ? (approveError ?? processError) : null}
          />
        ))}
      </div>
    </div>
  );
}