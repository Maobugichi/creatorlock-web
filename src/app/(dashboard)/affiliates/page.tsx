'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Affiliate {
  id: string;
  name: string;
  email: string;
  conversions: number;
  earnings_cents: number;
  status: 'active' | 'pending' | 'inactive';
}

interface AffiliateSummary {
  total_conversions: number;
  total_earnings_cents: number;
}

interface ApiError {
  response?: { data?: { message?: string } };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatNGN = (cents: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(cents / 100);

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Affiliate['status'] }) {
  const styles: Record<Affiliate['status'], string> = {
    active: 'bg-green-500/10 text-green-400 border border-green-500/20',
    pending: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    inactive: 'bg-white/5 text-[var(--muted)] border border-[var(--border)]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium font-mono ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="bg-surface border border-[var(--border)] rounded-2xl p-5 space-y-3"
        >
          <div className="h-3.5 w-28 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-7 w-40 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function AffiliateRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/[0.03] animate-pulse shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-3.5 w-32 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-3 w-48 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="h-3.5 w-10 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3.5 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-6 w-16 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

// ─── Affiliate Row ─────────────────────────────────────────────────────────────

function AffiliateRow({ affiliate }: { affiliate: Affiliate }) {
  const initials = affiliate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-white/[0.015] transition-colors">
      {/* Avatar + Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
          <span className="text-brand text-xs font-syne font-bold">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{affiliate.name}</p>
          <p className="text-[var(--muted)] text-xs truncate">{affiliate.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 shrink-0 ml-4">
        <div className="hidden sm:block text-right">
          <p className="text-white text-sm font-mono">{affiliate.conversions}</p>
          <p className="text-[var(--muted)] text-xs">conversions</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-white text-sm font-mono">{formatNGN(affiliate.earnings_cents)}</p>
          <p className="text-[var(--muted)] text-xs">earned</p>
        </div>
        <StatusBadge status={affiliate.status} />
      </div>
    </div>
  );
}

// ─── Invite Form ──────────────────────────────────────────────────────────────

function InviteAffiliateForm() {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const { mutate: inviteAffiliate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      api.post('/affiliates/invite', { email: formData.get('email') }),
    onSuccess: () => {
      formRef.current?.reset();
      setInviteError(null);
      setInviteSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      setTimeout(() => setInviteSuccess(false), 3000);
    },
    onError: (err: ApiError) => {
      setInviteError(
        err?.response?.data?.message ?? 'Something went wrong. Try again.'
      );
      setInviteSuccess(false);
    },
  });

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(false);
    const formData = new FormData(e.currentTarget);
    if (!formData.get('email')) {
      setInviteError('Email is required.');
      return;
    }
    inviteAffiliate(formData);
  }

  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
      <h2 className="text-white font-syne font-bold text-base mb-1">Invite an Affiliate</h2>
      <p className="text-[var(--muted)] text-sm mb-4">
        Share your affiliate program with someone who can promote your products.
      </p>

      {inviteError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
          {inviteError}
        </div>
      )}

      {inviteSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm mb-4">
          Invite sent successfully!
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
        <input
          name="email"
          type="email"
          placeholder="affiliate@example.com"
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-5 py-3 text-sm transition-all shrink-0"
        >
          {isPending && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isPending ? 'Sending…' : 'Send Invite'}
        </button>
      </form>
    </div>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCards({ summary }: { summary: AffiliateSummary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2">
          Total Conversions
        </p>
        <p className="text-white font-syne font-extrabold text-2xl font-mono">
          {summary.total_conversions.toLocaleString()}
        </p>
      </div>
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
        <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2">
          Total Affiliate Earnings Paid
        </p>
        <p className="text-white font-syne font-extrabold text-2xl font-mono">
          {formatNGN(summary.total_earnings_cents)}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AffiliatesPage() {
  const {
    data: affiliates,
    isLoading: affiliatesLoading,
    isError: affiliatesError,
  } = useQuery<Affiliate[]>({
    queryKey: ['affiliates'],
    queryFn: () =>
      api.get('/affiliates').then((res) => {
        const d = res.data;
        // Handle { affiliates: [] }, { data: [] }, or bare []
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.affiliates)) return d.affiliates;
        if (Array.isArray(d?.data)) return d.data;
        return [];
      }),
  });

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useQuery<AffiliateSummary>({
    queryKey: ['affiliates-summary'],
    queryFn: () =>
      api.get('/affiliates/summary').then((res) => {
        const d = res.data;
        // Handle wrapped { data: { ... } } or bare object
        return d?.data ?? d;
      }),
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-white font-syne font-extrabold text-2xl">Affiliates</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Manage your affiliate program and track commissions.
        </p>
      </div>

      {/* Summary Stats */}
      {summaryLoading ? (
        <SummarySkeleton />
      ) : summary ? (
        <SummaryCards summary={summary} />
      ) : null}

      {/* Invite Form */}
      <InviteAffiliateForm />

      {/* Affiliate List */}
      <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
        {/* List Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-white font-syne font-bold text-base">Your Affiliates</h2>
          {!affiliatesLoading && affiliates && affiliates.length > 0 && (
            <span className="text-[var(--muted)] text-xs font-mono">
              {affiliates.length} affiliate{affiliates.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Column Headers (desktop) */}
        {!affiliatesLoading && affiliates && affiliates.length > 0 && (
          <div className="hidden sm:flex items-center justify-between px-5 py-2 border-b border-[var(--border)] bg-white/[0.01]">
            <span className="text-[var(--muted)] text-xs uppercase tracking-wider flex-1">
              Affiliate
            </span>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-20 text-right">
                Conversions
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-24 text-right">
                Earned
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-16 text-right">
                Status
              </span>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {affiliatesLoading && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <AffiliateRowSkeleton key={i} />
            ))}
          </>
        )}

        {/* Error State */}
        {affiliatesError && !affiliatesLoading && (
          <div className="px-5 py-10 text-center">
            <p className="text-red-400 text-sm">Failed to load affiliates. Please refresh.</p>
          </div>
        )}

        {/* Empty State */}
        {!affiliatesLoading && !affiliatesError && affiliates && affiliates.length === 0 && (
          <div className="px-5 py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <p className="text-white font-syne font-bold text-base mb-1">No affiliates yet</p>
            <p className="text-[var(--muted)] text-sm">
              Invite someone above to start growing your affiliate network.
            </p>
          </div>
        )}

        {/* Affiliate Rows */}
        {!affiliatesLoading &&
          !affiliatesError &&
          affiliates &&
          affiliates.length > 0 &&
          affiliates.map((affiliate) => (
            <AffiliateRow key={affiliate.id} affiliate={affiliate} />
          ))}
      </div>
    </div>
  );
}