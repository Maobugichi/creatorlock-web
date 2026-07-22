'use client';

import { useMemo, useState } from 'react';
import { useAffiliates } from '../api/useAffiliate';
import { AffiliateRow } from '../components/affiliateRow';
import { InviteAffiliateForm } from '../components/inviteAffiliateForm';
import { SummaryCards } from '../components/summaryCards';
import { SummarySkeleton, AffiliateRowSkeleton } from '../components/skeletons';
import { AffiliateListControls, type StatusFilter, type SortOption } from '../components/affiliateListControls';
import { useBulkAffiliateActions } from '../api/useBulkAffiliateActions';

export default function AffiliatesPage() {
  const { data: affiliates, isLoading, isError, error } = useAffiliates();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { bulkDeactivate, bulkDelete, isProcessing } = useBulkAffiliateActions();

  function toggleSelectMode() {
    setSelectMode((v) => !v);
    setSelectedIds(new Set());
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const visibleAffiliates = useMemo(() => {
    if (!affiliates) return [];

    let result = affiliates;

    if (statusFilter !== 'all') {
      result = result.filter((a) => (statusFilter === 'active' ? a.active : !a.active));
    }

    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery) {
      result = result.filter(
        (a) =>
          a.affiliate_name.toLowerCase().includes(trimmedQuery) ||
          a.affiliate_email.toLowerCase().includes(trimmedQuery)
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'earned':
        sorted.sort((a, b) => b.total_earned_cents - a.total_earned_cents);
        break;
      case 'conversions':
        sorted.sort((a, b) => b.total_conversions - a.total_conversions);
        break;
    }

    return sorted;
  }, [affiliates, query, statusFilter, sortBy]);

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

      {!isLoading && affiliates && affiliates.length > 0 && (
        <AffiliateListControls
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      )}

      <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-white font-syne font-bold text-base">Your Affiliates</h2>
          <div className="flex items-center gap-3">
            {!isLoading && affiliates && affiliates.length > 0 && (
              <span className="text-[var(--muted)] text-xs font-mono">
                {visibleAffiliates.length === affiliates.length
                  ? `${affiliates.length} affiliate${affiliates.length !== 1 ? 's' : ''}`
                  : `${visibleAffiliates.length} of ${affiliates.length}`}
              </span>
            )}
            {!isLoading && affiliates && affiliates.length > 0 && (
              <button
                onClick={toggleSelectMode}
                className={`text-xs font-syne font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  selectMode
                    ? 'bg-brand/15 text-brand'
                    : 'bg-white/[0.04] text-[var(--muted)] hover:text-white border border-[var(--border)]'
                }`}
              >
                {selectMode ? 'Cancel' : 'Select'}
              </button>
            )}
          </div>
        </div>

        {!isLoading && affiliates && affiliates.length > 0 && (
          <div className="hidden sm:flex items-center justify-between px-5 py-2 border-b border-[var(--border)] bg-white/[0.01]">
            <span className="text-[var(--muted)] text-xs uppercase tracking-wider flex-1">Affiliate</span>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-20 text-right">Conversions</span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-24 text-right">Commission</span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-16 text-right">Status</span>
              <span className="text-[var(--muted)] text-xs uppercase tracking-wider w-64 text-right">Actions</span>
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
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="text-white font-syne font-bold text-base mb-1">No affiliates yet</p>
            <p className="text-[var(--muted)] text-sm">
              Add someone above to start growing your affiliate network.
            </p>
          </div>
        )}

        {!isLoading && !isError && affiliates && affiliates.length > 0 && visibleAffiliates.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-white font-syne font-bold text-base mb-1">No matches</p>
            <p className="text-[var(--muted)] text-sm">
              Try a different search term or filter.
            </p>
          </div>
        )}

        {!isLoading && !isError && visibleAffiliates.length > 0 &&
          visibleAffiliates.map((affiliate) => (
            <AffiliateRow
              key={affiliate.id}
              affiliate={affiliate}
              selectMode={selectMode}
              selected={selectedIds.has(affiliate.id)}
              onToggleSelect={() => toggleSelected(affiliate.id)}
            />
          ))}
      </div>

      {selectMode && selectedIds.size > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between gap-4 bg-surface border border-[var(--border)] rounded-2xl px-5 py-3.5 shadow-xl">
          <span className="text-white text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={isProcessing}
              onClick={() => {
                const targets = affiliates?.filter((a) => selectedIds.has(a.id)) ?? [];
                bulkDeactivate(targets);
                setSelectedIds(new Set());
              }}
              className="text-xs font-syne font-semibold px-3.5 py-2 rounded-lg bg-white/[0.06] text-white hover:bg-white/[0.1] transition-colors disabled:opacity-50"
            >
              Deactivate Selected
            </button>
            <button
              disabled={isProcessing}
              onClick={() => {
                const targets = affiliates?.filter((a) => selectedIds.has(a.id)) ?? [];
                bulkDelete(targets);
                setSelectedIds(new Set());
              }}
              className="text-xs font-syne font-semibold px-3.5 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}