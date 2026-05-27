'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatNGN } from '@/lib/utils';
import { SkeletonRow } from './skeleton-row';
import { ResendButton } from './resend-button';
import { ApiError, LibraryResponse, STATUS_STYLES } from '../_types';

export function LibraryList() {
  const { data, isLoading, isError, error } = useQuery<LibraryResponse>({
    queryKey: ['library'],
    queryFn: () => api.get<LibraryResponse>('/buyer/library').then((r) => r.data),
  });

  const purchases = data?.purchases ?? [];

  return (
    <>
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
    </>
  );
}