import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatNGN } from '@/lib/utils';
import { ArrowRightIcon, FileIcon } from '@/features/buyer/components/icons';
import type { DiscoverProduct } from '@/features/buyer/types/buyer.types';

export function DiscoverProductCardSkeleton() {
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

interface DiscoverProductCardProps {
  product: DiscoverProduct;
  index: number;
}

export function DiscoverProductCard({ product, index }: DiscoverProductCardProps) {
  const isFree = product.price_cents === 0;
  const fileCount = product.files.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.05, 0.3) }}
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
            {isFree ? <span className="text-emerald-400">Free</span> : formatNGN(product.price_cents)}
          </span>
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