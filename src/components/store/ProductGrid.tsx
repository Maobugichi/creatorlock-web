import { ProductWithFiles } from '@/types/store';
import ProductCard from './ProductCard';
import StorePagination from '@/features/buyer/components/storePagination';
import { Suspense } from 'react';

interface ProductGridProps {
  products: ProductWithFiles[];
  storeSlug: string;
  total: number;
  page: number;
  totalPages: number;
}

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface">
      <svg
        width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
      </svg>
    </div>
    <p className="font-syne text-sm font-bold text-surface-foreground">No products yet</p>
    <p className="mt-1 font-inter text-xs text-muted-foreground">
      This creator hasn&apos;t published any products yet.
    </p>
  </div>
);

export default function ProductGrid({ products, storeSlug, total , page, totalPages }: ProductGridProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-syne text-base font-bold text-surface-foreground">Products</h2>
        {total > 0 && (
          <span className="font-mono text-xs text-muted-foreground">
            {total} available
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
          ))
        )}
      </div>
       <Suspense fallback={null}>
        <StorePagination page={page} totalPages={totalPages} />
      </Suspense>
    </section>
  );
}