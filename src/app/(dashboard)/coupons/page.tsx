'use client';

// src/app/(dashboard)/coupons/page.tsx

import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface ApiError {
  response?: { data?: { message?: string } };
}

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  usage_count: number;
  max_uses: number | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

interface CouponsResponse {
  coupons: Coupon[];
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-28" />
        <div className="h-3 bg-white/5 rounded w-40" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 bg-white/5 rounded-full w-16" />
        <div className="h-8 bg-white/5 rounded-xl w-20" />
        <div className="h-8 bg-white/5 rounded-xl w-16" />
      </div>
    </div>
  );
}

// ── Coupon Row ───────────────────────────────────────────────────────────────

function CouponRow({ coupon }: { coupon: Coupon }) {
  const queryClient = useQueryClient();

  // Per-row delete confirm state — no modal, no global state
  const { mutate: toggleActive, isPending: toggling } = useMutation({
    mutationFn: async () => {
      await api.patch(`/coupons/${coupon.id}`, { active: !coupon.active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const {
    mutate: deleteCoupon,
    isPending: deleting,
    isError: deleteError,
    error: deleteErr,
    reset: resetDelete,
    variables: deleteVars,
  } = useMutation({
    mutationFn: async (confirmed: boolean) => {
      if (!confirmed) return;
      await api.delete(`/coupons/${coupon.id}`);
    },
    onSuccess: (_, confirmed) => {
      if (confirmed) {
        queryClient.invalidateQueries({ queryKey: ['coupons'] });
      }
    },
  });

  // Derive confirm state from mutation — no useState needed
  // isIdle + no variables = not started; variables = false means "pending confirm"
  const isPendingConfirm =
    !deleting && deleteVars === false;

  const expiryLabel = coupon.expires_at
    ? new Date(coupon.expires_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] last:border-0">
      {/* Left: code + meta */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-mono font-bold text-white tracking-wider">
          {coupon.code}
        </p>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          {coupon.discount_percent}% off
          {coupon.max_uses !== null && ` · ${coupon.usage_count}/${coupon.max_uses} uses`}
          {coupon.max_uses === null && coupon.usage_count > 0 && ` · ${coupon.usage_count} uses`}
          {expiryLabel && ` · Expires ${expiryLabel}`}
        </p>

        {/* Delete error — above actions per rule 8.3 */}
        {deleteError && (
          <p className="text-xs text-red-400 mt-1">
            {(deleteErr as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
          </p>
        )}
      </div>

      {/* Right: toggle + delete */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Active badge */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          coupon.active
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-white/5 text-[var(--muted)] border-white/10'
        }`}>
          {coupon.active ? 'Active' : 'Inactive'}
        </span>

        {/* Toggle */}
        <button
          onClick={() => toggleActive()}
          disabled={toggling}
          className="text-xs bg-[var(--bg)] border border-[var(--border)] hover:border-brand/40 text-white font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {toggling ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
          ) : coupon.active ? 'Deactivate' : 'Activate'}
        </button>

        {/* Delete: inline confirm pattern */}
        {isPendingConfirm ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => deleteCoupon(true)}
              disabled={deleting}
              className="text-xs bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40"
            >
              {deleting ? (
                <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
              ) : 'Confirm'}
            </button>
            <button
              onClick={() => resetDelete()}
              className="text-xs text-[var(--muted)] hover:text-white font-syne font-semibold px-2 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => deleteCoupon(false)}
            disabled={deleting}
            className="text-xs bg-[var(--bg)] border border-[var(--border)] hover:border-red-500/40 text-[var(--muted)] hover:text-red-400 font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}

// ── Create Coupon Form ───────────────────────────────────────────────────────

function CreateCouponForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const { mutate: create, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      await api.post('/coupons', payload);
    },
    onSuccess: () => {
      formRef.current?.reset();
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const code = (data.get('code') as string).trim().toUpperCase();
    const discount_percent = parseInt(data.get('discount_percent') as string, 10);
    const max_uses = data.get('max_uses') ? parseInt(data.get('max_uses') as string, 10) : null;
    const expires_at = data.get('expires_at') ? (data.get('expires_at') as string) : null;

    create({ code, discount_percent, max_uses, expires_at });
  };

  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <h2 className="font-syne font-bold text-base">Create coupon</h2>

      {/* Error above form — rule 8.3 */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
          {(error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 text-sm text-green-400">
          Coupon created successfully.
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Code */}
          <div className="space-y-1.5">
            <label htmlFor="code" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="SUMMER20"
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
              }}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono tracking-wider focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          {/* Discount */}
          <div className="space-y-1.5">
            <label htmlFor="discount_percent" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Discount (%)
            </label>
            <input
              id="discount_percent"
              name="discount_percent"
              type="number"
              required
              min={1}
              max={100}
              placeholder="20"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          {/* Max uses */}
          <div className="space-y-1.5">
            <label htmlFor="max_uses" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Max uses <span className="normal-case text-[var(--muted)]">(optional)</span>
            </label>
            <input
              id="max_uses"
              name="max_uses"
              type="number"
              min={1}
              placeholder="Unlimited"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          {/* Expiry date */}
          <div className="space-y-1.5">
            <label htmlFor="expires_at" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Expiry date <span className="normal-case text-[var(--muted)]">(optional)</span>
            </label>
            <input
              id="expires_at"
              name="expires_at"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating…
            </span>
          ) : (
            'Create coupon'
          )}
        </button>
      </form>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CouponsPage() {
  const { data, isLoading, isError, error } = useQuery<CouponsResponse>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await api.get<CouponsResponse>('/coupons');
      return res.data;
    },
  });

  const coupons = data?.coupons ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-syne font-extrabold">Coupons</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Create and manage discount codes for your products.</p>
      </div>

      {/* Create form */}
      <CreateCouponForm />

      {/* List */}
      <div className="space-y-3">
        <h2 className="font-syne font-bold text-lg">Your coupons</h2>

        {/* Page-level fetch error — rule 8.3 */}
        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
            {(error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
          </div>
        )}

        <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
          {isLoading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {!isLoading && !isError && coupons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-2">
              <p className="font-syne font-semibold text-white">No coupons yet</p>
              <p className="text-sm text-[var(--muted)]">
                Create your first coupon above to start offering discounts.
              </p>
            </div>
          )}

          {!isLoading && coupons.length > 0 && (
            <ul>
              {coupons.map((coupon) => (
                <CouponRow key={coupon.id} coupon={coupon} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}