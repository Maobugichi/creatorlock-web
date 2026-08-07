import Link from "next/link";

interface ProductsEmptyProps {
  filtered: boolean;
}

export default function ProductsEmpty({ filtered }: ProductsEmptyProps) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 text-muted-foreground opacity-20" aria-hidden="true">
          <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M32 40h16M40 32v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h3 className="font-syne font-bold text-surface-foreground text-lg mb-2">
          No products match this filter
        </h3>
        <p className="font-inter text-muted-foreground text-sm max-w-xs">
          Try a different filter to see your products.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 text-muted-foreground opacity-20" aria-hidden="true">
        <rect x="10" y="20" width="60" height="45" rx="6" stroke="currentColor" strokeWidth="2" />
        <path d="M25 20V16a15 15 0 0 1 30 0v4" stroke="currentColor" strokeWidth="2" />
        <path d="M32 42l6 6 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="font-syne font-bold text-surface-foreground text-lg mb-2">No products yet</h3>
      <p className="font-inter text-muted-foreground text-sm mb-6 max-w-xs">
        Upload your first digital product and start earning from your creativity.
      </p>
      <Link
        href="/products/new"
        className="bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl px-6 py-3 text-sm transition-all"
      >
        Upload your first product
      </Link>
    </div>
  );
}