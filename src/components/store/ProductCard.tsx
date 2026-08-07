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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-black/40"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-elevated">
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
            <span className="font-syne text-4xl font-extrabold opacity-20 text-primary">
              {product.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {isFree && (
          <span className="absolute left-3 top-3 rounded-lg border border-primary/30 bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
            FREE
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 font-syne text-sm font-bold leading-snug text-surface-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>

        {product.description && (
          <p className="line-clamp-2 font-inter text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-mono text-sm font-medium">
            {isFree ? (
              <span className="text-primary">Free</span>
            ) : (
              <span className="text-surface-foreground">{formatNGN(product.price_cents)}</span>
            )}
          </span>

          <div className="flex items-center gap-2">
            {fileCount > 0 && (
              <span className="flex items-center gap-1 font-inter text-[11px] text-muted-foreground">
                <FileIcon />
                {fileCount} {fileCount === 1 ? 'file' : 'files'}
              </span>
            )}

            <span className="rounded-lg border border-border text-muted-foreground px-2.5 py-1 font-mono text-[11px] font-medium transition-colors duration-200 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground">
              {isFree ? 'Get' : 'Buy'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}