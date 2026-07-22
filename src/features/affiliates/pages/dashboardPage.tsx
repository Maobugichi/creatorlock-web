'use client';

import { useAffiliateBalance } from '../api/useAffiliateBalance';
import { AffiliateBalanceCard, AffiliateBalanceCardSkeleton } from '../components/affiliateBalanceCard';
import { RequestPayoutForm } from '../components/requestPayoutForm';
import { CreatorBreakdown } from '../components/creatorBreakdown';
import { PayoutHistoryTable } from '../components/payoutHistorTable';

export default function AffiliateDashboardPage() {
  const { data: balance, isLoading: balanceLoading, isError: balanceError } = useAffiliateBalance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-syne font-extrabold text-2xl">Affiliate Dashboard</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Track your earnings and request payouts across every creator you promote.
        </p>
      </div>

      {balanceLoading && (
        <div className="bg-white/[0.02] border border-[var(--border)] rounded-2xl p-6 sm:p-8">
          <AffiliateBalanceCardSkeleton />
        </div>
      )}

      {balanceError && !balanceLoading && (
        <div className="bg-white/[0.02] border border-[var(--border)] rounded-2xl px-5 py-10 text-center">
          <p className="text-red-400 text-sm">Failed to load your balance. Please refresh.</p>
        </div>
      )}

      {!balanceLoading && !balanceError && balance && (
        <AffiliateBalanceCard {...balance} />
      )}

      {!balanceLoading && !balanceError && balance && (
        <RequestPayoutForm availableCents={balance.available} />
      )}

      <CreatorBreakdown />

      <PayoutHistoryTable />
    </div>
  );
}