'use client';

import { useState } from 'react';
import { formatNGN } from '@/lib/utils';
import { useWithdraw } from '../api/useWithdraw';
import { useBanks } from '../api/useBanks';
import { AccountResolver } from './accountResolver';
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
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="font-syne font-bold text-lg">Request withdrawal</h2>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Your full available balance of{' '}
          <span className="font-mono text-white">{formatNGN(availableCents)}</span>{' '}
          will be transferred after the platform fee.
        </p>
      </div>

      {withdrawSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 text-sm text-green-400">
          Withdrawal request submitted — pending admin approval. You&apos;ll be notified once it&apos;s processed.
        </div>
      )}

      {withdrawError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
          {(withdrawErr as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--muted)] uppercase tracking-widest block">Bank</label>
          <select
            value={bankCode}
            onChange={(e) => {
              setBankCode(e.target.value);
              setAccountName('');
              resetWithdraw();
            }}
            disabled={banksLoading}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors disabled:opacity-50"
          >
            <option value="">Select bank…</option>
            {banks.map((bank, i) => (
              <option key={`${bank.code}-${i}`} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-[var(--muted)] uppercase tracking-widest block">Account number</label>
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
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
      </div>

      <AccountResolver
        bankCode={bankCode}
        accountNumber={accountNumber}
        onResolved={(name) => setAccountName(name)}
        onReset={() => setAccountName('')}
      />

      <button
        onClick={() => withdraw({ bankCode, accountNumber })}
        disabled={!canWithdraw || withdrawing}
        className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {withdrawing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting…
          </span>
        ) : (
          `Withdraw ${formatNGN(availableCents)}`
        )}
      </button>
    </div>
  );
}