import type { Product, FilterStatus, SortOption } from "../types/product.types";

// ─── File Size ────────────────────────────────────────────────────────────────
// NOTE: formatFileSize likely duplicates @/lib/utils — verify and consolidate.
// If it exists there, delete this and import from @/lib/utils directly.

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
// NOTE: formatNGN likely duplicates @/lib/utils — verify and consolidate once
// the actual utils file is read. If it exists there, delete this and import
// from @/lib/utils directly in components that need it.

export function formatNGN(cents: number): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(iso: string): string {
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

// ─── Filter + Sort ────────────────────────────────────────────────────────────

export function filterAndSort(
  products: Product[],
  filter: FilterStatus,
  sort: SortOption
): Product[] {
  return products
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
}

export function buildCounts(products: Product[]): Record<FilterStatus, number> {
  return {
    all: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    unpublished: products.filter((p) => p.status === "unpublished").length,
    flagged: products.filter((p) => p.status === "flagged").length,
  };
}