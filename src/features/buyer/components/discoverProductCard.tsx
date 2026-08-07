import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { formatNGN } from '@/lib/utils';
import { ArrowRightIcon, FileIcon } from '@/features/buyer/components/icons';
import type { DiscoverProduct } from '@/features/buyer/types/buyer.types';
import { CATEGORY_OPTIONS } from '@/features/buyer/types/buyer.types';

export function DiscoverProductCardSkeleton() {
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

interface DiscoverProductCardProps {
  product: DiscoverProduct;
  index: number;
}

export function DiscoverProductCard({ product, index }: DiscoverProductCardProps) {
  const isFree = product.price_cents === 0;
  const fileCount = product.files.length;
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label;

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
            <div className="opacity-20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        )}

        {isFree && (
          <div className="absolute top-2 left-2 lg:top-3 lg:left-3">
            <span className="bg-primary/90 text-primary-foreground font-syne font-bold text-[9px] lg:text-[10px] uppercase tracking-wider px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-lg backdrop-blur-sm">
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
          <Link
            href={`/store/${product.store_slug}`}
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            {product.display_name}
          </Link>
        </div>

        {product.description && (
          <p className="hidden lg:block font-inter text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <span className="font-mono font-bold text-primary text-base">
            {isFree ? 'Free' : formatNGN(product.price_cents)}
          </span>

          <Link
            href={`/store/${product.store_slug}/${product.id}`}
            className="lg:hidden w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-all duration-200 hover:bg-primary hover:border-primary hover:text-primary-foreground"
            aria-label={`View ${product.title}`}
          >
            <ArrowRightIcon />
          </Link>

          <Link
            href={`/store/${product.store_slug}/${product.id}`}
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