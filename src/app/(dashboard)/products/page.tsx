"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import {
  PencilSimple,
  EyeSlash,
  FileDashed,
  Warning,
  Globe,
  CheckCircle,
  XCircle,
  Info,
  X,
  FunnelSimple,
  ArrowsDownUp,
  ArrowsDownUpIcon,
} from "@phosphor-icons/react";
import { ConfirmPopover } from "./_components/ConfirmPopup";
import { createPortal } from "react-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductStatus = "draft" | "published" | "unpublished" | "flagged";
type FilterStatus = "all" | ProductStatus;
type SortOption = "newest" | "oldest" | "price_high" | "price_low";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  status: ProductStatus;
  thumbnail?: string | null;
  created_at: string;
  updated_at?: string;
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

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

// ─── Toast system ─────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
}

const TOAST_ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const TOAST_STYLES: Record<ToastVariant, { icon: string; border: string }> = {
  success: { icon: "text-emerald-400", border: "border-emerald-500/20" },
  error: { icon: "text-red-400", border: "border-red-500/20" },
  info: { icon: "text-brand", border: "border-brand/20" },
};

function ToastItem({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const Icon = TOAST_ICONS[toast.variant];
  const styles = TOAST_STYLES[toast.variant];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm bg-[#111] border ${styles.border} rounded-2xl px-4 py-3.5 shadow-xl animate-in slide-in-from-right-4 fade-in duration-200`}
    >
      <Icon size={16} weight="fill" className={`${styles.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="font-syne font-semibold text-white text-sm">{toast.message}</p>
        {toast.description && (
          <p className="font-inter text-white/40 text-xs mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/20 hover:text-white/60 transition-colors shrink-0"
      >
        <X size={13} weight="bold" />
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info", description?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, description, variant }]);
    },
    []
  );

  return { toasts, dismiss, show };
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProductStatus,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  published: {
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Published",
  },
  draft: {
    icon: FileDashed,
    color: "text-white/40",
    bg: "bg-white/[0.05]",
    border: "border-white/10",
    label: "Draft",
  },
  unpublished: {
    icon: EyeSlash,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Unpublished",
  },
  flagged: {
    icon: Warning,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Flagged",
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProductStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border ${config.color} ${config.bg} ${config.border}`}
      title={config.label}
    >
      <Icon size={11} weight="bold" />
    </span>
  );
}



// ─── Skeleton Card ────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-white/[0.03]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/[0.03] rounded-xl w-3/4" />
        <div className="h-3 bg-white/[0.03] rounded-xl w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-white/[0.03] rounded-lg w-20" />
          <div className="h-7 bg-white/[0.03] rounded-xl w-7" />
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
  const [showConfirm, setShowConfirm] = useState(false);

  const canToggle =
    product.status === "published" ||
    product.status === "draft" ||
    product.status === "unpublished";

  const isPublished = product.status === "published";
  const pendingAction: "publish" | "unpublish" = isPublished ? "unpublish" : "publish";

  function handleToggleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isToggling && canToggle) {
      setShowConfirm(true);
    }
  }

  function handleConfirm() {
    setShowConfirm(false);
    onToggle(product.id, product.status);
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  return (
    <div
      className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-colors group"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* Thumbnail */}
      <div className="h-36 bg-[var(--bg)] flex items-center justify-center overflow-hidden relative">
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

        {/* Edit icon */}
        <Link
          href={`/products/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/80 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Edit product"
        >
          <PencilSimple size={12} weight="bold" />
        </Link>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-syne font-bold text-white text-sm leading-snug line-clamp-1 mb-1 group-hover:text-brand transition-colors">
          {product.title}
        </h3>

        {/* Price · Updated at */}
        <p className="font-mono text-[10px] text-white/30 mb-3 truncate">
          {formatNGN(product.price_cents)}
          {product.updated_at && (
            <span className="text-white/20"> · {formatRelativeTime(product.updated_at)}</span>
          )}
        </p>

        {/* Bottom row: status badge + toggle only */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={product.status} />

          {canToggle && (
            <div className="relative shrink-0">
              <button
                onClick={handleToggleClick}
                disabled={isToggling}
                className={`flex items-center justify-center gap-1.5 px-2.5 h-7 rounded-lg border text-[10px] font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPublished
                    ? "border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                {isToggling ? (
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : isPublished ? "Unlist" : "List"}
              </button>

              {showConfirm && (
                <ConfirmPopover
                  action={pendingAction}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter + Sort Bar ────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "unpublished", label: "Unpublished" },
  { value: "flagged", label: "Flagged" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_high", label: "Price (high → low)" },
  { value: "price_low", label: "Price (low → high)" },
];

interface FilterSortBarProps {
  filter: FilterStatus;
  sort: SortOption;
  onFilterChange: (f: FilterStatus) => void;
  onSortChange: (s: SortOption) => void;
  counts: Record<FilterStatus, number>;
}

function FilterSortBar({ filter, sort, onFilterChange, onSortChange, counts }: FilterSortBarProps) {

  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    function handleClick(e: MouseEvent) {

      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {

        setSortOpen(false);

      }

    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);

  }, []);



  const activeSort = SORT_OPTIONS.find((o) => o.value === sort)!;



  return (

    <div className="flex flex-col sm:flex-row gap-3 mb-6">

      {/* Filter pills */}

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1">

        {FILTER_OPTIONS.map((opt) => {

          const isActive = filter === opt.value;

          const count = counts[opt.value];

          return (

            <button

              key={opt.value}

              onClick={() => onFilterChange(opt.value)}

              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-inter font-medium whitespace-nowrap transition-colors shrink-0 ${

                isActive

                  ? "bg-brand/10 border-brand/30 text-brand"

                  : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/15"

              }`}

            >

              {opt.label}

              <span

                className={`font-mono text-[10px] px-1 py-0.5 rounded-md ${

                  isActive ? "bg-brand/20 text-brand" : "bg-white/[0.05] text-white/25"

                }`}

              >

                {count}

              </span>

            </button>

          );

        })}

      </div>



      {/* Custom sort dropdown */}

      <div ref={sortRef} className="relative w-fit">

        <button

          onClick={() => setSortOpen((v) => !v)}

          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-inter font-medium transition-colors w-full sm:w-auto ${

            sortOpen

              ? "bg-brand/10 border-brand/30 text-brand"

              : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/15"

          }`}

        >

          <ArrowsDownUpIcon size={12} weight="bold" />

          <span>{activeSort.label}</span>

          <svg

            width="10"

            height="10"

            viewBox="0 0 24 24"

            fill="none"

            stroke="currentColor"

            strokeWidth="2.5"

            strokeLinecap="round"

            strokeLinejoin="round"

            className={`ml-auto transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}

          >

            <polyline points="6 9 12 15 18 9" />

          </svg>

        </button>



        {sortOpen && (

          <div className="absolute top-full right-24 left-20 mt-1.5 z-20 w-48 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl">

            {SORT_OPTIONS.map((opt) => {

              const isActive = sort === opt.value;

              return (

                <button

                  key={opt.value}

                  onClick={() => {

                    onSortChange(opt.value);

                    setSortOpen(false);

                  }}

                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-inter transition-colors ${

                    isActive

                      ? "text-brand bg-brand/10"

                      : "text-white/50 hover:text-white hover:bg-white/[0.04]"

                  }`}

                >

                  {opt.label}

                  {isActive && <CheckCircle size={13} weight="fill" className="text-brand" />}

                </button>

              );

            })}

          </div>

        )}

      </div>

    </div>

  );

}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 opacity-20" aria-hidden="true">
        <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="2" />
        <path d="M40 26v18" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="52" r="1.5" fill="white" />
      </svg>
      <h3 className="font-syne font-bold text-white text-lg mb-2">Couldn&apos;t load your products</h3>
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

function EmptyState({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 opacity-20" aria-hidden="true">
          <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M32 40h16M40 32v16" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h3 className="font-syne font-bold text-white text-lg mb-2">No products match this filter</h3>
        <p className="font-inter text-[var(--muted)] text-sm max-w-xs">
          Try a different filter to see your products.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 opacity-20" aria-hidden="true">
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
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const { toasts, dismiss, show: showToast } = useToast();

  const { data: products, isLoading, isError, refetch } = useQuery<Product[], ApiError>({
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

  const toggleMutation = useMutation<
    void,
    ApiError,
    { id: string; action: "publish" | "unpublish" },
    { previous: Product[] | undefined }
  >({
    mutationFn: async ({ id, action }) => {
      await api.post(`/products/${id}/${action}`);
    },
    onMutate: async ({ id, action }) => {
      setTogglingId(id);
      await queryClient.cancelQueries({ queryKey: ["products", "me"] });
      const previous = queryClient.getQueryData<Product[]>(["products", "me"]);
      queryClient.setQueryData<Product[]>(["products", "me"], (old) =>
        old?.map((p) =>
          p.id === id ? { ...p, status: action === "publish" ? "published" : "unpublished" } : p
        )
      );
      return { previous };
    },
    onSuccess: (_, { action }) => {
      showToast(
        action === "publish" ? "Product published" : "Product unpublished",
        action === "publish" ? "success" : "info",
        action === "publish"
          ? "Your product is now live in your store."
          : "Your product has been hidden from your store."
      );
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products", "me"], context.previous);
      }
      const message = err?.response?.data?.message ?? "Something went wrong";
      showToast(message, "error");
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

  // ── Filter + sort ───────────────────────────────────────────────────────────

  const filteredAndSorted = (products ?? [])
    .filter((p) => filter === "all" || p.status === filter)
    .sort((a, b) => {
      switch (sort) {
        case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price_high": return b.price_cents - a.price_cents;
        case "price_low": return a.price_cents - b.price_cents;
        default: return 0;
      }
    });

  const counts: Record<FilterStatus, number> = {
    all: products?.length ?? 0,
    published: products?.filter((p) => p.status === "published").length ?? 0,
    draft: products?.filter((p) => p.status === "draft").length ?? 0,
    unpublished: products?.filter((p) => p.status === "unpublished").length ?? 0,
    flagged: products?.filter((p) => p.status === "flagged").length ?? 0,
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

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
            className="bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl transition-all flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 sm:text-sm"
            aria-label="New product"
          >
            <span className="text-lg leading-none sm:hidden">+</span>
            <span className="hidden sm:inline">+ New product</span>
          </Link>
        </div>

        {/* Error state */}
        {isError && <ErrorState onRetry={refetch} />}

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Loaded state */}
        {!isLoading && !isError && products && (
          <>
            {products.length === 0 ? (
              <EmptyState filtered={false} />
            ) : (
              <>
                <FilterSortBar
                  filter={filter}
                  sort={sort}
                  onFilterChange={setFilter}
                  onSortChange={setSort}
                  counts={counts}
                />

                {filteredAndSorted.length === 0 ? (
                  <EmptyState filtered={true} />
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAndSorted.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onToggle={handleToggle}
                        isToggling={togglingId === product.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}