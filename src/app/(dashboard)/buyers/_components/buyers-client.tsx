'use client';

import { useBuyers } from '../_hooks/useBuyer';
import { SummaryCards } from './summary-cards';
import { BuyerRowItem } from './buyer-row';
import { ExportButton } from './export-button';
import { SummaryCardSkeleton, BuyerRowSkeleton } from './skeleton';

export function BuyersClient() {
  const { buyers, isLoading, isError } = useBuyers();

  

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-syne font-extrabold text-2xl">Buyers</h1>
          <p className="text-[var(--muted)] text-sm mt-1">
            Everyone who has purchased your products.
          </p>
        </div>
        {!isLoading && buyers.length > 0 && <ExportButton />}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SummaryCardSkeleton key={i} />)}
        </div>
      ) : !isError && buyers.length > 0 ? (
        <SummaryCards buyers={buyers} />
      ) : null}

      <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-white font-syne font-bold text-base">Buyer List</h2>
          {!isLoading && buyers.length > 0 && (
            <span className="text-[var(--muted)] text-xs font-mono">
              {buyers.length.toLocaleString()} buyer{buyers.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!isLoading && buyers.length > 0 && (
          <div className="hidden sm:flex items-center justify-between px-5 py-2 border-b border-[var(--border)] bg-white/[0.01]">
            <span className="text-[var(--muted)] text-xs uppercase tracking-wider flex-1">Buyer</span>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              {['Orders', 'Spent', 'Last Order'].map((col) => (
                <span key={col} className="text-[var(--muted)] text-xs uppercase tracking-wider w-20 text-right">
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {isLoading && [0, 1, 2, 3, 4].map((i) => <BuyerRowSkeleton key={i} />)}

        {isError && !isLoading && (
          <div className="px-5 py-10 text-center">
            <p className="text-red-400 text-sm">Failed to load buyers. Please refresh.</p>
          </div>
        )}

        {!isLoading && !isError && buyers.length === 0 && (
          <div className="px-5 py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-white font-syne font-bold text-base mb-1">No buyers yet</p>
            <p className="text-[var(--muted)] text-sm">
              Buyers will appear here once someone purchases one of your products.
            </p>
          </div>
        )}

        {!isLoading && !isError && buyers.length > 0 &&
          buyers.map((buyer) => <BuyerRowItem key={buyer.buyer_id} buyer={buyer} />)
        }
      </div>
    </div>
  );
}