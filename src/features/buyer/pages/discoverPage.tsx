'use client';

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDiscoverProducts } from '@/features/buyer/api/useDiscoverProducts';
import { SearchIcon } from '@/features/buyer/components/icons';
import {
  DiscoverProductCard,
  DiscoverProductCardSkeleton,
} from '@/features/buyer/components/discoverProductCard';
import { DiscoverErrorBanner } from '@/features/buyer/components/discoverErrorBanner';
import { DiscoverEmptyState } from '@/features/buyer/components/discoverEmptyState';
import { DiscoverPagination } from '@/features/buyer/components/discoverPagination';
import type { SortOption } from '@/features/buyer/types/buyer.types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
];

const DEBOUNCE_MS = 300;

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [page, setPage] = useState(1);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, DEBOUNCE_MS);
  }, []);

  const handleSortChange = useCallback((value: SortOption) => {
    setSort(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    isFetching,
    refetch,
  } = useDiscoverProducts({ search: debouncedSearch, sort, page });

  const products = productsData?.products ?? [];
  const totalPages = productsData?.totalPages ?? 1;
  const total = productsData?.total ?? 0;

  const showSkeletons = productsLoading;
  const showGrid = !productsLoading && !productsError;
  const showFetchingOverlay = isFetching && !productsLoading;

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-20">
      <div className="border-b border-[var(--border)] bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand mb-2">
              Marketplace
            </p>
            <h1 className="font-syne font-extrabold text-white text-3xl sm:text-4xl leading-tight">
              Discover Products
            </h1>
            <p className="font-inter text-[var(--muted)] text-sm mt-2">
              Browse digital goods from Nigerian creators — eBooks, courses, templates, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.07 }}
            className="mt-6 relative"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--muted)]">
              <SearchIcon />
            </div>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products…"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 font-inter text-white text-sm placeholder:text-[var(--muted)] focus:border-brand/60 focus:ring-1 focus:ring-brand/20 outline-none transition-all"
              aria-label="Search products"
            />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-6 space-y-5">
        <AnimatePresence>
          {productsError && (
            <DiscoverErrorBanner
              message="Failed to load products. Please check your connection and try again."
              onRetry={() => refetch()}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-between gap-4"
        >
          <span className="font-mono text-xs text-[var(--muted)] min-w-0">
            {!productsLoading && total > 0
              ? `${total.toLocaleString('en-NG')} result${total !== 1 ? 's' : ''}`
              : null}
          </span>

          <div className="flex items-center bg-surface border border-[var(--border)] rounded-xl p-1 gap-1 shrink-0">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={[
                  'rounded-lg px-3 py-1.5 font-syne font-semibold text-xs transition-all',
                  sort === option.value ? 'bg-brand text-white' : 'text-[var(--muted)] hover:text-white',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div
          className={[
            'transition-opacity duration-200',
            showFetchingOverlay ? 'opacity-60 pointer-events-none' : 'opacity-100',
          ].join(' ')}
        >
          {showSkeletons && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <DiscoverProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {showGrid && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 lg:grid-cols-3">
              {products.length === 0 ? (
                <DiscoverEmptyState search={debouncedSearch} />
              ) : (
                products.map((product, index) => (
                  <DiscoverProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>
          )}
        </div>

        {showGrid && products.length > 0 && (
          <DiscoverPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        )}
      </div>
    </main>
  );
}