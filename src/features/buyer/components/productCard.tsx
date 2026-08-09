'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatNGN } from '@/lib/utils';
import { ArrowRightIcon, FileIcon } from '@/features/buyer/components/icons';

interface ProductCardProduct {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  price_cents: number;
  files?: unknown[];
}

interface ProductCardProps {
  product: ProductCardProduct;
  storeSlug: string;
  displayName?: string;
  categoryLabel?: string;
  index?: number;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="bg-elevated animate-pulse aspect-[4/3] w-full" />
      <div className="p-3 lg:p-4 flex flex-col flex-1 space-y-3">
        <div className="bg-elevated rounded-lg animate-pulse h-4 w-16" />
        <div className="space-y-1.5">
          <div className="bg-elevated rounded-xl animate-pulse h-4 w-full" />
          <div className="bg-elevated rounded-xl animate-pulse h-4 w-3/4" />
        </div>
        <div className="bg-elevated rounded-xl animate-pulse h-3 w-full hidden lg:block" />
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="bg-elevated rounded-xl animate-pulse h-5 w-24" />
          <div className="bg-elevated rounded-xl animate-pulse h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, storeSlug, displayName, categoryLabel, index = 0 }: ProductCardProps) {
  const isFree = product.price_cents === 0;
  const fileCount = product.files?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-syne font-extrabold text-muted-foreground/40 select-none">
              {product.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {isFree && (
          <div className="absolute top-2 left-2 lg:top-3 lg:left-3">
            <span className="bg-price/90 text-price-foreground font-syne font-bold text-[9px] lg:text-[10px] uppercase tracking-wider px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-lg backdrop-blur-sm">
              Free
            </span>
          </div>
        )}

        {categoryLabel && (
          <div className="hidden lg:block absolute top-3 right-3">
            <span className="bg-black/50 border border-white/10 text-white font-syne font-semibold text-[10px] uppercase tracking-wider px-2 py-1 rounded-lg backdrop-blur-sm">
              {categoryLabel}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 lg:p-4 flex flex-col flex-1 space-y-2.5 lg:space-y-3">
        {fileCount > 0 && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileIcon />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              {fileCount} {fileCount === 1 ? 'file' : 'files'}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1 lg:flex-row lg:items-start lg:justify-between lg:gap-2">
          <h3 className="font-syne font-bold text-surface-foreground text-sm leading-snug line-clamp-2">
            {product.title}
          </h3>
          {displayName && (
            <Link
              href={`/store/${storeSlug}`}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              {displayName}
            </Link>
          )}
        </div>

        {product.description && (
          <p className="hidden lg:block font-inter text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <span className="font-mono font-bold text-price text-base">
            {isFree ? 'Free' : formatNGN(product.price_cents)}
          </span>

          <Link
            href={`/store/${storeSlug}/${product.id}`}
            className="lg:hidden w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-all duration-200 hover:bg-primary hover:border-primary hover:text-primary-foreground"
            aria-label={`View ${product.title}`}
          >
            <ArrowRightIcon />
          </Link>

          <Link
            href={`/store/${storeSlug}/${product.id}`}
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-primary font-syne font-semibold text-xs transition-all duration-200 hover:bg-primary hover:border-primary hover:text-primary-foreground group/btn"
          >
            View
            <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
              <ArrowRightIcon />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}