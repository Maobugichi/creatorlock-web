'use client';

// src/app/(dashboard)/payouts/page.tsx

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatNGN } from '@/lib/utils';

interface ApiError {
  response?: { data?: { message?: string } };
}

interface BalanceResponse {
  available_cents: number;
  pending_cents: number;
}

interface Bank {
  code: string;
  name: string;
}

interface BanksResponse {
  banks: Bank[];
}

interface ResolveResponse {
  account_name: string;
}

interface Payout {
  id: string;
  amount_cents: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  bank_name: string;
  account_number: string;
  account_name: string;
  created_at: string;
}

interface PayoutsResponse {
  payouts: Payout[];
}

const STATUS_STYLES: Record<Payout['status'], { label: string; classes: string }> = {
  pending:    { label: 'Pending',    classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  processing: { label: 'Processing', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  paid:       { label: 'Paid',       classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  failed:     { label: 'Failed',     classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

function BalanceCard({ available_cents, pending_cents }: BalanceResponse) {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6">
      <p className="text-xs text-[var(--muted)] uppercase tracking-widest mb-1">Available balance</p>
      <p className="font-mono text-4xl font-bold text-white">{formatNGN(available_cents)}</p>
      {pending_cents > 0 && (
        <p className="text-xs text-[var(--muted)] mt-2">
          <span className="font-mono">{formatNGN(pending_cents)}</span> pending clearance
        </p>
      )}
      <p className="text-xs text-[var(--muted)] mt-3">After 7% platform fee</p>
    </div>
  );
}

function BalanceCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 animate-pulse space-y-3">
      <div className="h-3 bg-white/10 rounded w-32" />
      <div className="h-10 bg-white/10 rounded w-48" />
      <div className="h-3 bg-white/5 rounded w-24" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-white/10 rounded w-24" />
        <div className="h-6 bg-white/5 rounded-full w-20" />
      </div>
    </div>
  );
}

// Separate component so its own mutation state is scoped — no cross-contamination with withdraw mutation
interface AccountResolverProps {
  bankCode: string;
  accountNumber: string;
  onResolved: (name: string) => void;
  onReset: () => void;
}

function AccountResolver({ bankCode, accountNumber, onResolved, onReset }: AccountResolverProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKeyRef = useRef('');

  const { mutate, isPending, isSuccess, isError, error, reset } = useMutation({
    mutationFn: async ({ code, number }: { code: string; number: string }) => {
      const res = await api.get<ResolveResponse>('/payouts/resolve', {
        params: { bank_code: code, account_number: number },
      });
      return res.data;
    },
    onSuccess: (data) => {
      onResolved(data.account_name);
    },
    onError: () => {
      onReset();
    },
  });

  // Only fire the debounce when the key actually changes — no setState in effect body
  useEffect(() => {
    const key = `${bankCode}:${accountNumber}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Reset parent immediately when inputs change so canWithdraw recalculates
    onReset();
    reset();

    if (!bankCode || accountNumber.length !== 10) return;

    debounceRef.current = setTimeout(() => {
      mutate({ code: bankCode, number: accountNumber });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [bankCode, accountNumber]);

  if (!bankCode || accountNumber.length !== 10) return null;

  return (
    <div className="min-h-[1.25rem]">
      {isPending && (
        <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
          <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          Verifying account…
        </p>
      )}
      {isSuccess && (
        <p className="text-xs text-green-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Account verified
        </p>
      )}
      {isError && (
        <p className="text-xs text-red-400">
          {(error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
        </p>
      )}
    </div>
  );
}

export default function PayoutsPage() {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amountNaira, setAmountNaira] = useState('');

  const { data: balanceData, isLoading: balanceLoading } = useQuery<BalanceResponse>({
    queryKey: ['payouts', 'balance'],
    queryFn: async () => {
      const res = await api.get<BalanceResponse>('/payouts/balance');
      return res.data;
    },
  });

  const { data: banksData, isLoading: banksLoading } = useQuery<BanksResponse>({
    queryKey: ['payouts', 'banks'],
    queryFn: async () => {
      const res = await api.get<BanksResponse>('/payouts/banks');
      return res.data;
    },
  });

  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useQuery<PayoutsResponse>({
    queryKey: ['payouts', 'me'],
    queryFn: async () => {
      const res = await api.get<PayoutsResponse>('/payouts/me');
      return res.data;
    },
  });

  const {
    mutate: withdraw,
    isPending: withdrawing,
    isSuccess: withdrawSuccess,
    isError: withdrawError,
    error: withdrawErr,
    reset: resetWithdraw,
  } = useMutation({
    mutationFn: async () => {
      await api.post('/payouts/request', {
        amount_cents: Math.round(parseFloat(amountNaira) * 100),
        bank_code: bankCode,
        account_number: accountNumber,
        account_name: accountName,
      });
    },
    onSuccess: () => {
      setAmountNaira('');
      setBankCode('');
      setAccountNumber('');
      setAccountName('');
      refetchHistory();
    },
  });

  const availableCents = balanceData?.available_cents ?? 0;
  const amountCents = Math.round(parseFloat(amountNaira || '0') * 100);
  const canWithdraw =
    !!accountName &&
    amountCents > 0 &&
    amountCents <= availableCents &&
    availableCents > 0;

  const payouts = historyData?.payouts ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-syne font-extrabold">Payouts</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Withdraw your earnings to your Nigerian bank account.</p>
      </div>

      {balanceLoading ? (
        <BalanceCardSkeleton />
      ) : balanceData ? (
        <BalanceCard {...balanceData} />
      ) : null}

      <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-5">
        <h2 className="font-syne font-bold text-lg">Request withdrawal</h2>

        {withdrawSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 text-sm text-green-400">
            Withdrawal request submitted. You`&apos;`ll receive your funds within 1–3 business days.
          </div>
        )}

        {/* Error above form — rule 8.3 */}
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
              {banksData?.banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
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

        {/* AccountResolver is a separate component — its effect only communicates upward via callbacks, no setState in its own effect body */}
        <AccountResolver
          bankCode={bankCode}
          accountNumber={accountNumber}
          onResolved={(name) => setAccountName(name)}
          onReset={() => setAccountName('')}
        />

        <div className="space-y-1.5">
          <label className="text-xs text-[var(--muted)] uppercase tracking-widest block">Amount (₦)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] text-sm font-mono">₦</span>
            <input
              type="number"
              min="1"
              value={amountNaira}
              onChange={(e) => {
                setAmountNaira(e.target.value);
                resetWithdraw();
              }}
              placeholder="0"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          {amountCents > availableCents && amountCents > 0 && (
            <p className="text-xs text-red-400">Amount exceeds available balance.</p>
          )}
        </div>

        <button
          onClick={() => withdraw()}
          disabled={!canWithdraw || withdrawing}
          className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {withdrawing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </span>
          ) : (
            `Withdraw ${amountNaira ? formatNGN(amountCents) : ''}`
          )}
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="font-syne font-bold text-lg">Payout history</h2>

        <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
          {historyLoading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {!historyLoading && payouts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-2">
              <p className="font-syne font-semibold text-white">No payouts yet</p>
              <p className="text-sm text-[var(--muted)]">Your withdrawal history will appear here.</p>
            </div>
          )}

          {!historyLoading && payouts.length > 0 && (
            <ul className="divide-y divide-[var(--border)]">
              {payouts.map((payout) => {
                const statusStyle = STATUS_STYLES[payout.status] ?? STATUS_STYLES.pending;
                return (
                  <li key={payout.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-syne font-semibold text-white">
                        {payout.bank_name}
                        <span className="font-mono font-normal text-[var(--muted)] ml-2 text-xs">
                          ···{payout.account_number.slice(-4)}
                        </span>
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {payout.account_name} ·{' '}
                        {new Date(payout.created_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-sm text-white">{formatNGN(payout.amount_cents)}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.classes}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}