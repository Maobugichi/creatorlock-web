"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductStatus = "draft" | "published" | "unpublished" | "flagged";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  status: ProductStatus;
  thumbnail?: string | null;
  created_at: string;
}

interface ApiError {
  response?: { data?: { message?: string } };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNGN(cents: number): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_STYLES: Record<ProductStatus, string> = {
  draft: "bg-white/[0.08] text-white/60 border border-white/10",
  published: "bg-green-500/15 text-green-400 border border-green-500/20",
  unpublished: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  flagged: "bg-red-500/15 text-red-400 border border-red-500/20",
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-white/[0.03]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/[0.03] rounded-xl w-3/4" />
        <div className="h-3 bg-white/[0.03] rounded-xl w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-white/[0.03] rounded-lg w-16" />
          <div className="h-8 bg-white/[0.03] rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  onToggle: (id: string, currentStatus: ProductStatus) => void;
  isToggling: boolean;
}

function ProductCard({ product, onToggle, isToggling }: ProductCardProps) {
  const router = useRouter();
  const canToggle =
    product.status === "published" || product.status === "draft" || product.status === "unpublished";

  function handleToggleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isToggling && canToggle) {
      onToggle(product.id, product.status);
    }
  }

  return (
    <div
      className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-colors group"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* Thumbnail */}
      <div className="h-40 bg-[var(--bg)] flex items-center justify-center overflow-hidden relative">
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-syne font-extrabold text-white/10 select-none">
            {product.title.charAt(0).toUpperCase()}
          </span>
        )}
        {/* Status badge overlaid on thumbnail */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-inter font-medium px-2 py-0.5 rounded-lg uppercase tracking-wide ${STATUS_STYLES[product.status]}`}
        >
          {product.status}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-syne font-bold text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-brand transition-colors">
          {product.title}
        </h3>

        <p className="font-mono text-[var(--muted)] text-xs mb-4">
          {formatNGN(product.price_cents)}
        </p>

        <div className="flex items-center gap-2">
          {/* Toggle button */}
          {canToggle && (
            <button
              onClick={handleToggleClick}
              disabled={isToggling}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-inter font-medium border border-[var(--border)] text-[var(--muted)] hover:border-white/20 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isToggling ? (
                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {product.status === "published" ? "Unpublish" : "Publish"}
            </button>
          )}

          {/* Edit link */}
          <Link
            href={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto text-xs font-inter text-[var(--muted)] hover:text-white transition-colors"
          >
            Edit →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="mb-6 opacity-20"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="2" />
        <path d="M40 26v18" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="52" r="1.5" fill="white" />
      </svg>
      <h3 className="font-syne font-bold text-white text-lg mb-2">
        Couldn&apos;t load your products
      </h3>
      <p className="font-inter text-[var(--muted)] text-sm mb-6 max-w-xs">
        Something went wrong on our end. Your products are safe — give it another try.
      </p>
      <button
        onClick={onRetry}
        className="bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-white font-syne font-semibold rounded-xl px-6 py-3 text-sm transition-all border border-white/[0.08]"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Simple SVG illustration */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className="mb-6 opacity-20"
        aria-hidden="true"
      >
        <rect x="10" y="20" width="60" height="45" rx="6" stroke="white" strokeWidth="2" />
        <path d="M25 20V16a15 15 0 0 1 30 0v4" stroke="white" strokeWidth="2" />
        <path d="M32 42l6 6 10-10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="font-syne font-bold text-white text-lg mb-2">No products yet</h3>
      <p className="font-inter text-[var(--muted)] text-sm mb-6 max-w-xs">
        Upload your first digital product and start earning from your creativity.
      </p>
      <Link
        href="/products/new"
        className="bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl px-6 py-3 text-sm transition-all"
      >
        Upload your first product
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // In products/page.tsx — replace the queryFn inside useQuery:

const {
  data: products,
  isLoading,
  isError,
  refetch,
} = useQuery<Product[], ApiError>({
  queryKey: ["products", "me"],
  queryFn: async () => {
    const res = await api.get<{
      success: boolean;
      data: { products: Product[]; total: number; page: number; totalPages: number };
    }>("/products/me");
    return res.data.data.products;
  },
  retry: 1,
});

  console.log(products)

  const [toggleError, setToggleError] = useState<string | null>(null);

  const toggleMutation = useMutation<void, ApiError, { id: string; action: "publish" | "unpublish" }>({
    mutationFn: async ({ id, action }) => {
      await api.post(`/products/${id}/${action}`);
    },
    onMutate: ({ id }) => {
      setToggleError(null);
      setTogglingId(id);
    },
    onError: (err) => {
    
      const message = err?.response?.data?.message ?? "Something went wrong";
      setToggleError(message);
    },
    onSettled: () => {
      setTogglingId(null);
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
    },
  });

  function handleToggle(id: string, currentStatus: ProductStatus) {
    const action = currentStatus === "published" ? "unpublish" : "publish";
    toggleMutation.mutate({ id, action });
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-white text-2xl">Products</h1>
          {!isLoading && !isError && products && (
            <p className="font-inter text-[var(--muted)] text-sm mt-0.5">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>
        <Link
          href="/products/new"
          className="bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl px-5 py-2.5 text-sm transition-all"
        >
          + New product
        </Link>
      </div>

      {toggleError && (
  <div className="mb-6 bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 font-inter">
    {toggleError}
  </div>
)}
      {/* Error state */}
      {isError && <ErrorState onRetry={refetch} />}

      {/* Skeleton loaders */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && products?.length === 0 && <EmptyState />}

      {/* Product grid */}
      {!isLoading && !isError && products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggle={handleToggle}
              isToggling={togglingId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}