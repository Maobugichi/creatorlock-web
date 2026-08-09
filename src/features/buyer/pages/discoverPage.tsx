'use client';

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDiscoverProducts } from '@/features/buyer/api/useDiscoverProducts';
import { ProductCard, ProductCardSkeleton } from '@/features/buyer/components/productCard';
import { DiscoverErrorBanner } from '@/features/buyer/components/discoverErrorBanner';
import { DiscoverEmptyState } from '@/features/buyer/components/discoverEmptyState';
import { DiscoverPagination } from '@/features/buyer/components/discoverPagination';
import type { SortOption, ProductCategory } from '@/features/buyer/types/buyer.types';
import { CATEGORY_OPTIONS } from '@/features/buyer/types/buyer.types';
import { SearchIcon, ShieldIcon, BoltIcon, NairaIcon } from '@/features/buyer/components/icons';

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
  const [category, setCategory] = useState<ProductCategory | null>(null);

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

  const handleCategoryChange = useCallback((value: ProductCategory | null) => {
    setCategory(value);
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
  } = useDiscoverProducts({ search: debouncedSearch, sort, category, page });

  const products = productsData?.products ?? [];
  const totalPages = productsData?.totalPages ?? 1;
  const total = productsData?.total ?? 0;

  const showSkeletons = productsLoading;
  const showGrid = !productsLoading && !productsError;
  const showFetchingOverlay = isFetching && !productsLoading;

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary mb-2">
              Marketplace
            </p>
            <h1 className="font-syne font-extrabold text-surface-foreground text-3xl sm:text-4xl leading-tight">
              Discover Products
            </h1>
            <p className="font-inter text-muted-foreground text-sm mt-2">
              Browse digital goods from Nigerian creators — eBooks, courses, templates, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.07 }}
            className="mt-6 relative"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
              <SearchIcon />
            </div>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products…"
              className="w-full bg-elevated border border-border rounded-xl pl-10 pr-4 py-3 font-inter text-surface-foreground text-sm placeholder:text-muted-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              aria-label="Search products"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
            className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide"
          >
            <button
              onClick={() => handleCategoryChange(null)}
              className={[
                'shrink-0 rounded-full px-3.5 py-1.5 font-syne font-semibold text-xs transition-all border',
                category === null
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-surface-foreground hover:border-primary/40',
              ].join(' ')}
            >
              All
            </button>
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleCategoryChange(opt.value)}
                className={[
                  'shrink-0 rounded-full px-3.5 py-1.5 font-syne font-semibold text-xs transition-all border',
                  category === opt.value
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-surface-foreground hover:border-primary/40',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.13 }}
            className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldIcon />
              <span className="font-inter text-xs">Secure checkout via Paystack</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BoltIcon />
              <span className="font-inter text-xs">Instant digital delivery</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <NairaIcon />
              <span className="font-inter text-xs">Nigerian creators, Naira pricing</span>
            </div>
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
          <span className="font-mono text-xs text-muted-foreground min-w-0">
            {!productsLoading && total > 0
              ? `${total.toLocaleString('en-NG')} result${total !== 1 ? 's' : ''}`
              : null}
          </span>

          <div className="flex items-center bg-surface border border-border rounded-xl p-1 gap-1 shrink-0">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={[
                  'rounded-lg px-3 py-1.5 font-syne font-semibold text-xs transition-all',
                  sort === option.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-surface-foreground',
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
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {showGrid && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products.length === 0 ? (
                <DiscoverEmptyState search={debouncedSearch} />
              ) : (
                products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    storeSlug={product.store_slug}
                    displayName={product.display_name}
                    categoryLabel={CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label}
                    index={index}
                  />
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