'use client';

import { useBalance } from '../api/useBalance';
import { BalanceCard, BalanceCardSkeleton } from '../component/balanceCard';
import { WithdrawalForm } from '../component/withdrawalForm';
import { PayoutHistory } from '../component/payoutHistory';

export default function PayoutsPage() {
  const { data: balanceData, isLoading: balanceLoading } = useBalance();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 space-y-10 sm:space-y-14">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-syne font-extrabold tracking-tight">Payouts</h1>
        <p className="text-sm text-[var(--muted)]">
          Withdraw your earnings to your Nigerian bank account.
        </p>
      </div>

      {balanceLoading ? (
        <BalanceCardSkeleton />
      ) : balanceData ? (
        <BalanceCard {...balanceData} />
      ) : null}

      <WithdrawalForm availableCents={balanceData?.available ?? 0} />

      <PayoutHistory />
    </div>
  );
}