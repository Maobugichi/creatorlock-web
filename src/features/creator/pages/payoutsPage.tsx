'use client';

import { useBalance } from '../api/useBalance';
import { BalanceCard, BalanceCardSkeleton } from '../component/balanceCard';
import { WithdrawalForm } from '../component/withdrawalForm';
import { PayoutHistory } from '../component/payoutHistory';

export default function PayoutsPage() {
  const { data: balanceData, isLoading: balanceLoading } = useBalance();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-syne font-extrabold">Payouts</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
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