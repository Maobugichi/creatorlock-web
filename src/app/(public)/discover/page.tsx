'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { formatNGN } from '@/lib/utils';

// ─── Wire-accurate types ──────────────────────────────────────────────────────
// Derived directly from product.service.ts: Product + ProductWithFiles
// Response envelope confirmed from listPublished controller: { success, data }

interface ProductFile {
  id: string;
  product_id: string;
  url: string;
  public_id: string;
  original_name: string | null;
  format: string | null;
  size: number | null;
  created_at: string;
}

interface DiscoverProduct {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  thumbnail: string | null;
  status: 'draft' | 'published' | 'unpublished' | 'deleted';
  created_at: string;
  updated_at: string;
  files: ProductFile[];

  display_name: string;
  store_slug: string;
}

// Mirrors PaginatedProducts from product.service.ts
interface PaginatedProducts {
  products: DiscoverProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Controller wraps in { success: true, data: PaginatedProducts }
interface GetProductsResponse {
  success: true;
  data: PaginatedProducts;
}

type SortOption = 'latest' | 'popular';



const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
];

const DEBOUNCE_MS = 300;

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === 'left' ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="bg-white/[0.03] animate-pulse aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="bg-white/[0.03] rounded-lg animate-pulse h-4 w-16" />
        <div className="space-y-1.5">
          <div className="bg-white/[0.03] rounded-xl animate-pulse h-4 w-full" />
          <div className="bg-white/[0.03] rounded-xl animate-pulse h-4 w-3/4" />
        </div>
        <div className="bg-white/[0.03] rounded-xl animate-pulse h-3 w-full" />
        <div className="flex items-center justify-between pt-1">
          <div className="bg-white/[0.03] rounded-xl animate-pulse h-5 w-24" />
          <div className="bg-white/[0.03] rounded-xl animate-pulse h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: DiscoverProduct;
  index: number;
}

function DiscoverProductCard({ product, index }: ProductCardProps) {
  const isFree = product.price_cents === 0;
  const fileCount = product.files.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
        delay: Math.min(index * 0.05, 0.3),
      }}
      className="group bg-surface border border-[var(--border)] rounded-2xl overflow-hidden hover:border-brand/30 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/[0.02]">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="opacity-20">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        )}

        {isFree && (
          <div className="absolute top-3 left-3">
            <span className="bg-emerald-500/90 text-white font-syne font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded-lg backdrop-blur-sm">
              Free
            </span>
          </div>
        )}
      </div>

    
      <div className="p-4 space-y-3">
        {fileCount > 0 && (
          <div className="flex items-center gap-1.5 text-[var(--muted)]">
            <FileIcon />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {fileCount} {fileCount === 1 ? 'file' : 'files'}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <h3 className="font-syne font-bold text-white text-sm leading-snug line-clamp-2">
            {product.title}
          </h3>

          <Link
            href={`/store/${product.store_slug}`}
            className="inline-flex items-center gap-1 text-[10px] text-[var(--muted)] hover:text-brand transition-colors"
          >
            {/*<UserIcon className="w-3 h-3" /> */}
            {product.display_name}
          </Link>
        </div>

        {product.description && (
          <p className="font-inter text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
          <span className="font-mono font-bold text-white text-sm">
            {isFree ? (
              <span className="text-emerald-400">Free</span>
            ) : (
              formatNGN(product.price_cents)
            )}
          </span>

          {/* Product link ONLY on arrow */}
          <Link
            href={`/store/${product.store_slug}/${product.id}`}
            className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand transition-all duration-200 hover:bg-brand hover:border-brand hover:text-white"
          >
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 flex items-center justify-between gap-4 font-inter text-sm"
    >
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="shrink-0 text-red-400 hover:text-red-300 font-syne font-semibold text-xs underline underline-offset-2 transition-colors"
      >
        Retry
      </button>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  search: string;
}

function EmptyState({ search }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-[var(--border)] flex items-center justify-center mb-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--muted)]"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="font-syne font-bold text-white text-base mb-1">
        {search.length > 0 ? 'No products found' : 'No products yet'}
      </p>
      <p className="font-inter text-sm text-[var(--muted)] max-w-xs">
        {search.length > 0
          ? 'Try adjusting your search term.'
          : 'Check back soon — creators are publishing new products daily.'}
      </p>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching: boolean;
}

function Pagination({ page, totalPages, onPageChange, isFetching }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      pages.push(i);
    } else if (
      (i === page - delta - 1 && i > 1) ||
      (i === page + delta + 1 && i < totalPages)
    ) {
      pages.push('ellipsis');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isFetching}
        className="w-9 h-9 rounded-xl border border-[var(--border)] bg-surface flex items-center justify-center text-[var(--muted)] hover:text-white hover:border-brand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronIcon direction="left" />
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center font-mono text-xs text-[var(--muted)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={isFetching}
            className={[
              'w-9 h-9 rounded-xl border font-mono text-xs transition-all disabled:cursor-not-allowed',
              p === page
                ? 'bg-brand border-brand text-white font-bold'
                : 'border-[var(--border)] bg-surface text-[var(--muted)] hover:text-white hover:border-brand/40',
            ].join(' ')}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isFetching}
        className="w-9 h-9 rounded-xl border border-[var(--border)] bg-surface flex items-center justify-center text-[var(--muted)] hover:text-white hover:border-brand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  // ── Filter state — live reactive block ───────────────────────────────────
  // §8.2 exception: every state change must immediately retrigger useQuery.
  // Controlled inputs are required to coordinate debounce + query key updates.
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [page, setPage] = useState(1);

  // ── Search debounce — 300ms prevents per-keystroke API calls ─────────────
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setDebouncedSearch(value);
        setPage(1);
      }, DEBOUNCE_MS);
    },
    []
  );

  const handleSortChange = useCallback((value: SortOption) => {
    setSort(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Products query ────────────────────────────────────────────────────────
  // Unwrap from { success: true, data: PaginatedProducts } envelope.
  // keepPreviousData: grid never flashes blank between page/sort transitions.
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    isFetching,
    refetch,
  } = useQuery<PaginatedProducts>({
    queryKey: ['discover-products', { search: debouncedSearch, sort, page }],
    queryFn: async () => {
      const params: Record<string, string | number> = { sort, page };
      if (debouncedSearch.trim().length > 0) params.search = debouncedSearch.trim();

      const { data } = await api.get<GetProductsResponse>('/products', { params });
      return data.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });

  console.log(productsData)
  const products = productsData?.products ?? [];
  const totalPages = productsData?.totalPages ?? 1;
  const total = productsData?.total ?? 0;

  const showSkeletons = productsLoading;
  const showGrid = !productsLoading && !productsError;
  const showFetchingOverlay = isFetching && !productsLoading;

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-20">

      {/* ── Hero header ───────────────────────────────────────────────────── */}
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

          {/* ── Search ──────────────────────────────────────────────────── */}
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

        {/* ── Error banner ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {productsError && (
            <ErrorBanner
              message="Failed to load products. Please check your connection and try again."
              onRetry={() => refetch()}
            />
          )}
        </AnimatePresence>

        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center justify-between gap-4"
        >
          {/* Result count */}
          <span className="font-mono text-xs text-[var(--muted)] min-w-0">
            {!productsLoading && total > 0
              ? `${total.toLocaleString('en-NG')} result${total !== 1 ? 's' : ''}`
              : null}
          </span>

          {/* Sort toggle */}
          <div className="flex items-center bg-surface border border-[var(--border)] rounded-xl p-1 gap-1 shrink-0">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={[
                  'rounded-lg px-3 py-1.5 font-syne font-semibold text-xs transition-all',
                  sort === option.value
                    ? 'bg-brand text-white'
                    : 'text-[var(--muted)] hover:text-white',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Product grid ───────────────────────────────────────────────── */}
        <div
          className={[
            'transition-opacity duration-200',
            showFetchingOverlay ? 'opacity-60 pointer-events-none' : 'opacity-100',
          ].join(' ')}
        >
          {showSkeletons && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {showGrid && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.length === 0 ? (
                <EmptyState search={debouncedSearch} />
              ) : (
                products.map((product, index) => (
                  <DiscoverProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {showGrid && products.length > 0 && (
          <Pagination
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