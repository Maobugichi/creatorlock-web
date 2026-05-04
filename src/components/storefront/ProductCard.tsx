"use client";

import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorefrontProduct {
  id: string;
  title: string;
  description?: string;
  price_cents: number;
  thumbnail_url?: string | null;
  file_count?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNGN(cents: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  slug,
}: {
  product: StorefrontProduct;
  slug: string;
}) {
  return (
    <Link
      href={`/store/${slug}/${product.id}`}
      className="group bg-surface border border-[var(--border)] rounded-2xl overflow-hidden hover:border-white/20 transition-colors block"
    >
      {/* Thumbnail */}
      <div className="h-44 bg-[var(--bg)] flex items-center justify-center overflow-hidden relative">
        {product.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl font-syne font-extrabold text-white/10 select-none">
            {product.title.charAt(0).toUpperCase()}
          </span>
        )}
        {/* Free badge */}
        {product.price_cents === 0 && (
          <span className="absolute top-3 left-3 bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] font-inter font-medium px-2 py-0.5 rounded-lg uppercase tracking-wide">
            Free
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-syne font-bold text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-brand transition-colors">
          {product.title}
        </h3>

        {product.description && (
          <p className="font-inter text-[var(--muted)] text-xs line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="font-mono text-white font-bold text-sm">
            {product.price_cents === 0 ? "Free" : formatNGN(product.price_cents)}
          </span>
          {product.file_count != null && product.file_count > 0 && (
            <span className="text-[var(--muted)] font-inter text-xs">
              {product.file_count} {product.file_count === 1 ? "file" : "files"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}