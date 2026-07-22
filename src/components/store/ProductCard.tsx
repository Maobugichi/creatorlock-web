'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ProductWithFiles } from '@/types/store';
import { formatNGN } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithFiles;
  storeSlug: string;
}

const FileIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default function ProductCard({ product, storeSlug }: ProductCardProps) {
  const isFree = product.price_cents === 0;
  const fileCount = product.files.length;

  return (
    <Link
      href={`/store/${storeSlug}/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10 hover:shadow-xl hover:shadow-black/40"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
    >
      {/* ── Thumbnail ────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg)]">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-syne text-4xl font-extrabold opacity-20 text-brand">
              {product.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {isFree && (
          <span className="absolute left-3 top-3 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
            FREE
          </span>
        )}
      </div>

      {/* ── Body ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 font-syne text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="line-clamp-2 font-inter text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {product.description}
          </p>
        )}

        
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-mono text-sm font-medium">
            {isFree ? (
              <span className="text-emerald-400">Free</span>
            ) : (
              <span className="text-white">{formatNGN(product.price_cents)}</span>
            )}
          </span>

          <div className="flex items-center gap-2">
            {fileCount > 0 && (
              <span className="flex items-center gap-1 font-inter text-[11px]" style={{ color: 'var(--muted)' }}>
                <FileIcon />
                {fileCount} {fileCount === 1 ? 'file' : 'files'}
              </span>
            )}

            <span className="rounded-lg text-[var(--muted)] border-[var(--border)] border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-200 group-hover:bg-brand group-hover:border-brand group-hover:text-white"
              style={{
                borderColor: '',
                color: '',
              }}
            >
              {isFree ? 'Get' : 'Buy'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}