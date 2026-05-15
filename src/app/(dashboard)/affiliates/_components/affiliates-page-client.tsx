'use client';

import { useAffiliates } from '../_hooks/useAffiliates';
import { AffiliateRow } from './affiliates-row';
import { InviteAffiliateForm } from './invite-affiliate-form';
import { SummaryCards } from './summary-cards';
import { SummarySkeleton, AffiliateRowSkeleton } from './skeletons';

export function AffiliatesPageClient() {
  const { data: affiliates, isLoading, isError , error } = useAffiliates();

  if (isError) {
    console.log(error)
  }
  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-white font-syne font-extrabold text-2xl">Affiliates</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Manage your affiliate program and track commissions.
        </p>
      </div>

      
      {isLoading ? (
        <SummarySkeleton />
      ) : affiliates && affiliates.length > 0 ? (
        <SummaryCards affiliates={affiliates} />
      ) : null}

     
      <InviteAffiliateForm />

      
      <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
      
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-white font-syne font-bold text-base">Your Affiliates</h2>
          {!isLoading && affiliates && affiliates.length > 0 && (
            <span className="text-[var(--muted)] text-xs font-mono">
              {affiliates.length} affiliate{affiliates.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        
        {!isLoading && affiliates && affiliates.length > 0 && (
          <div className="hidden sm:flex items-center justify-between px-5 py-2 border-b border-[var(--border)] bg-white/[0.01]">
            <span className="text-[var(--muted)] text-xs uppercase tracking-wider flex-1">
              Affiliate
            </span>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-20 text-right">
                Conversions
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-24 text-right">
                Commission
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-16 text-right">
                Status
              </span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-20 text-right">
                Actions
              </span>
            </div>
          </div>
        )}

       
        {isLoading && [0, 1, 2, 3].map((i) => <AffiliateRowSkeleton key={i} />)}

   
        {isError && !isLoading && (
          <div className="px-5 py-10 text-center">
            <p className="text-red-400 text-sm">Failed to load affiliates. Please refresh.</p>
          </div>
        )}

        
        {!isLoading && !isError && affiliates && affiliates.length === 0 && (
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
              Add someone above to start growing your affiliate network.
            </p>
          </div>
        )}

       
        {!isLoading &&
          !isError &&
          affiliates &&
          affiliates.length > 0 &&
          affiliates.map((affiliate) => (
            <AffiliateRow key={affiliate.id} affiliate={affiliate} />
          ))}
      </div>
    </div>
  );
}