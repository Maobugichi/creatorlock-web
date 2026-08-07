'use client';

import { useState } from 'react';
import { formatNGN } from '@/lib/utils';
import { useWithdraw } from '../api/useWithdraw';
import { useBanks } from '@/features/shared/api/useBanks';
import { AccountResolver } from '@/features/shared/component/accountResolver';
import { SearchableDropdown } from '@/components/ui/searchableDropDown';
import { MINIMUM_PAYOUT_CENTS } from '../utils/payout.utils';
import type { ApiError } from '../types/payout.types';

interface WithdrawalFormProps {
  availableCents: number;
}

export function WithdrawalForm({ availableCents }: WithdrawalFormProps) {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const { banks, isLoading: banksLoading } = useBanks();
  const bankOptions = banks.map((bank) => ({ value: bank.code, label: bank.name }));

  const {
    mutate: withdraw,
    isPending: withdrawing,
    isSuccess: withdrawSuccess,
    isError: withdrawError,
    error: withdrawErr,
    reset: resetWithdraw,
  } = useWithdraw({
    onSuccess: () => {
      setBankCode('');
      setAccountNumber('');
      setAccountName('');
    },
  });

  const canWithdraw =
    !!accountName &&
    !!bankCode &&
    accountNumber.length === 10 &&
    availableCents >= MINIMUM_PAYOUT_CENTS;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-7">
      <h2 className="font-syne font-bold text-lg">Request withdrawal</h2>

      {withdrawSuccess && (
        <div className="rounded-2xl border border-success/20 bg-success/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-success">Withdrawal requested</p>
          <p className="text-sm text-success/70 mt-0.5">
            Pending admin approval — you&apos;ll be notified once it&apos;s processed.
          </p>
        </div>
      )}

      {withdrawError && (
        <div className="rounded-2xl border border-status-exception/20 bg-status-exception/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-status-exception">Withdrawal failed</p>
          <p className="text-sm text-status-exception/70 mt-0.5">
            {(withdrawErr as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Withdrawal amount</p>
        <p className="font-mono text-2xl sm:text-3xl font-bold text-success truncate">
          {formatNGN(availableCents)}
        </p>
        <p className="text-xs text-muted-foreground">Full balance, after 7% platform fee</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border pt-6">
        <SearchableDropdown
          label="Bank"
          options={bankOptions}
          value={bankCode}
          onChange={(code) => {
            setBankCode(code);
            setAccountName('');
            resetWithdraw();
          }}
          placeholder="Select bank…"
          searchPlaceholder="Search banks…"
          emptyMessage="No banks match your search."
          disabled={banksLoading}
        />

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground block">
            Account number
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={accountNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setAccountNumber(val);
              setAccountName('');
              resetWithdraw();
            }}
            placeholder="0123456789"
            className="w-full bg-elevated border border-border rounded-xl px-4 py-3.5 text-sm text-surface-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <AccountResolver
        bankCode={bankCode}
        accountNumber={accountNumber}
        onResolved={(name) => setAccountName(name)}
        onReset={() => setAccountName('')}
      />

      <div className="space-y-3">
        <button
          onClick={() => withdraw({ bankCode, accountNumber })}
          disabled={!canWithdraw || withdrawing}
          className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl py-3.5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {withdrawing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            'Request Withdrawal'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Withdrawal requests are reviewed before being sent to your bank. Most requests are processed
          within 24 hours.
        </p>
      </div>
    </div>
  );
}