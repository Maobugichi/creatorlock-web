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
  total_earned: number;
  total_paid_out: number;
  available: number;
}

interface Bank {
  code: string;
  name: string;
}

interface ResolveResponse {
  account_name: string;
  account_number: string;
}

interface Payout {
  id: string;
  amount_cents: number;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'failed' | 'reversed';
  bank_code: string;
  account_number: string;
  account_name: string;
  requested_at: string;
  failure_reason: string | null;
}

const STATUS_STYLES: Record<Payout['status'], { label: string; classes: string }> = {
  pending:    { label: 'Pending',    classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  approved:   { label: 'Approved',   classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  processing: { label: 'Processing', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  paid:       { label: 'Paid',       classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  failed:     { label: 'Failed',     classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  reversed:   { label: 'Reversed',   classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
};

const MINIMUM_PAYOUT_CENTS = 500_000; // ₦5,000 — mirrors backend constant

function BalanceCard({ available, total_earned, total_paid_out }: BalanceResponse) {
  const hasPendingPayout = total_paid_out > 0 && available === 0;

  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <div>
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest mb-1">Available balance</p>
        <p className="font-mono text-4xl font-bold text-white">{formatNGN(available)}</p>
        <p className="text-xs text-[var(--muted)] mt-2">
          <span className="font-mono">{formatNGN(total_earned)}</span> total earned
          {' · '}
          <span className="font-mono">{formatNGN(total_paid_out)}</span> paid out
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">After 7% platform fee</p>
      </div>

      {/* ADD THIS */}
      {hasPendingPayout && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-blue-400">
          You have a payout in progress. Your balance will update once it&apos;s completed or rejected.
        </div>
      )}

      {available < MINIMUM_PAYOUT_CENTS && available > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-xs text-orange-400">
          Minimum withdrawal is {formatNGN(MINIMUM_PAYOUT_CENTS)}.{' '}
          You need {formatNGN(MINIMUM_PAYOUT_CENTS - available)} more to request a payout.
        </div>
      )}
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

interface AccountResolverProps {
  bankCode: string;
  accountNumber: string;
  onResolved: (name: string) => void;
  onReset: () => void;
}

function AccountResolver({ bankCode, accountNumber, onResolved, onReset }: AccountResolverProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKeyRef  = useRef('');

  const { mutate, isPending, isSuccess, isError, error, reset, data } = useMutation({
    mutationFn: async ({ code, number }: { code: string; number: string }) => {
      const res = await api.get<{ success: boolean; data: ResolveResponse }>(
        '/payouts/resolve',
        { params: { bank_code: code, account_number: number } }
      );
      return res.data.data;
    },
    onSuccess: (data) => onResolved(data.account_name),
    onError:   ()     => onReset(),
  });

  useEffect(() => {
    const key = `${bankCode}:${accountNumber}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    if (debounceRef.current) clearTimeout(debounceRef.current);

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
      {isSuccess && data && (
        <p className="text-xs text-green-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {data.account_name}
        </p>
      )}
      {isError && (
        <p className="text-xs text-red-400">
          {(error as ApiError)?.response?.data?.message ?? 'Could not verify account. Check the details and try again.'}
        </p>
      )}
    </div>
  );
}

export default function PayoutsPage() {
  const [bankCode,       setBankCode]       = useState('');
  const [accountNumber,  setAccountNumber]  = useState('');
  const [accountName,    setAccountName]    = useState('');

  const { data: balanceData, isLoading: balanceLoading } = useQuery<BalanceResponse>({
    queryKey: ['payouts', 'balance'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BalanceResponse }>('/payouts/balance');
      
      return res.data.data;
    },
  });

  const { data: banksData, isLoading: banksLoading } = useQuery<{ banks: Bank[] }>({
    queryKey: ['payouts', 'banks'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Bank[] }>('/payouts/banks');
      return { banks: res.data.data };
    },
    staleTime: Infinity, // bank list doesn't change — no need to refetch
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useQuery<{ payouts: Payout[] }>({
    queryKey: ['payouts', 'me'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Payout[] }>('/payouts/me');
      return { payouts: res.data.data };
    },
  });

  const {
    mutate:   withdraw,
    isPending: withdrawing,
    isSuccess: withdrawSuccess,
    isError:   withdrawError,
    error:     withdrawErr,
    reset:     resetWithdraw,
  } = useMutation({
    // Backend calculates the amount — only send bank details
    mutationFn: async () => {
      await api.post('/payouts/request', {
        bank_code:      bankCode,
        account_number: accountNumber,
      });
    },
    onSuccess: () => {
      setBankCode('');
      setAccountNumber('');
      setAccountName('');
      refetchHistory();
    },
  });

  const availableCents = balanceData?.available ?? 0;
  const canWithdraw =
    !!accountName &&
    !!bankCode &&
    accountNumber.length === 10 &&
    availableCents >= MINIMUM_PAYOUT_CENTS;

  const payouts = historyData?.payouts ?? [];

  const resolveBankName = (code: string) =>
    banksData?.banks.find((b) => b.code === code)?.name ?? code;

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
              {banksData?.banks.map((bank, i) => (
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
            `Withdraw ${formatNGN(availableCents)}`
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
                  <li
                    key={payout.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-syne font-semibold text-white">
                        {resolveBankName(payout.bank_code)}
                        <span className="font-mono font-normal text-[var(--muted)] ml-2 text-xs">
                          ···{payout.account_number.slice(-4)}
                        </span>
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {payout.account_name}
                        {' · '}
                        {new Date(payout.requested_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      {payout.failure_reason && payout.status === 'failed' && (
                        <p className="text-xs text-red-400 mt-0.5">{payout.failure_reason}</p>
                      )}
                      {payout.status === 'reversed' && (
                        <p className="text-xs text-yellow-400 mt-0.5">
                          Transfer was reversed — contact support if funds were deducted.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-sm text-white">
                        {formatNGN(payout.amount_cents)}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.classes}`}
                      >
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