interface ProductsErrorProps {
  onRetry: () => void;
}

export default function ProductsError({ onRetry }: ProductsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 opacity-20" aria-hidden="true">
        <circle cx="40" cy="40" r="28" stroke="white" strokeWidth="2" />
        <path d="M40 26v18" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="52" r="1.5" fill="white" />
      </svg>
      <h3 className="font-syne font-bold text-white text-lg mb-2">
        Couldn&apos;t load your products
      </h3>
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