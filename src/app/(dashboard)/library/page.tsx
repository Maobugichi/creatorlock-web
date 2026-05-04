'use client';

// src/app/(dashboard)/library/page.tsx

import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatNGN } from '@/lib/utils';

interface ApiError {
  response?: { data?: { message?: string } };
}

interface Purchase {
  id: string;
  product_id: string;
  product_title: string;
  price_cents: number;
  purchased_at: string;
  status: 'active' | 'expired' | 'refunded';
}

interface LibraryResponse {
  purchases: Purchase[];
}

const STATUS_STYLES: Record<Purchase['status'], { label: string; classes: string }> = {
  active:   { label: 'Active',   classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  expired:  { label: 'Expired',  classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  refunded: { label: 'Refunded', classes: 'bg-white/5 text-[var(--muted)] border-white/10' },
};

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-2/5" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-white/10 rounded w-20" />
        <div className="h-6 bg-white/5 rounded-full w-16" />
        <div className="h-8 bg-white/5 rounded-xl w-24" />
      </div>
    </div>
  );
}

function ResendButton({ purchaseId }: { purchaseId: string }) {
  // isSuccess from useMutation — no manual useState + setTimeout needed
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async () => {
      await api.post(`/buyer/library/${purchaseId}/resend`);
    },
  });

  return (
    <div className="flex flex-col items-end gap-1">
      {/* Error above the action per rule 8.3 */}
      {isError && (
        <p className="text-xs text-red-400">
          {(error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
        </p>
      )}

      <button
        onClick={() => mutate()}
        disabled={isPending || isSuccess}
        className="flex items-center gap-1.5 text-sm bg-[var(--bg)] border border-[var(--border)] hover:border-brand/40 text-white font-syne font-semibold rounded-xl px-4 py-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : isSuccess ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Sent!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Resend link
          </>
        )}
      </button>
    </div>
  );
}

export default function LibraryPage() {
  const { data, isLoading, isError, error } = useQuery<LibraryResponse>({
    queryKey: ['library'],
    queryFn: async () => {
      const res = await api.get<LibraryResponse>('/buyer/library');
      return res.data;
    },
  });

  const purchases = data?.purchases ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-syne font-extrabold">My Library</h1>
        <p className="text-sm text-[var(--muted)] mt-1">All your purchased products and download links.</p>
      </div>

      {/* Page-level error — above content per rule 8.3 */}
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

        {!isLoading && !isError && purchases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
            <div className="w-14 h-14 bg-white/5 border border-[var(--border)] rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-syne font-semibold text-white">No purchases yet</p>
              <p className="text-sm text-[var(--muted)] mt-1">Browse products and grab something you love.</p>
            </div>
            <Link
              href="/"
              className="inline-block bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-2.5 px-6 text-sm transition-all duration-150"
            >
              Browse products
            </Link>
          </div>
        )}

        {!isLoading && purchases.length > 0 && (
          <ul className="divide-y divide-[var(--border)]">
            {purchases.map((purchase) => {
              const statusStyle = STATUS_STYLES[purchase.status] ?? STATUS_STYLES.active;
              return (
                <li key={purchase.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-syne font-semibold text-white truncate">
                      {purchase.product_title}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {new Date(purchase.purchased_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-sm text-white">
                      {purchase.price_cents === 0 ? 'Free' : formatNGN(purchase.price_cents)}
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle.classes}`}>
                      {statusStyle.label}
                    </span>

                    <ResendButton purchaseId={purchase.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}