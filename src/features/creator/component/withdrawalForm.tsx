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
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 sm:p-8 space-y-7">
      <h2 className="font-syne font-bold text-lg">Request withdrawal</h2>

      {withdrawSuccess && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-green-400">Withdrawal requested</p>
          <p className="text-sm text-green-400/70 mt-0.5">
            Pending admin approval — you&apos;ll be notified once it&apos;s processed.
          </p>
        </div>
      )}

      {withdrawError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4">
          <p className="text-sm font-semibold text-red-400">Withdrawal failed</p>
          <p className="text-sm text-red-400/70 mt-0.5">
            {(withdrawErr as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Withdrawal amount</p>
        <p className="font-mono text-2xl sm:text-3xl font-bold text-white truncate">
          {formatNGN(availableCents)}
        </p>
        <p className="text-xs text-[var(--muted)]">Full balance, after 7% platform fee</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[var(--border)] pt-6">
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
          <label className="text-xs uppercase tracking-[0.14em] text-[var(--muted)] block">
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
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 transition-colors"
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
          className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3.5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {withdrawing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            'Request Withdrawal'
          )}
        </button>

        <p className="text-xs text-[var(--muted)] text-center">
          Withdrawal requests are reviewed before being sent to your bank. Most requests are processed
          within 24 hours.
        </p>
      </div>
    </div>
  );
}