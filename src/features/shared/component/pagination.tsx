// features/shared/component/pagination.tsx
'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  size?: 'sm' | 'lg';
}

function getPageWindow(current: number, total: number, delta = 1): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];

  if (current - delta > 2) pages.push('ellipsis');

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current + delta < total - 1) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left' ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

export function Pagination({ page, totalPages, onPageChange, isFetching = false, size = 'lg' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-11 h-11';

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isFetching}
        className={`${dim} rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-surface-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all`}
        aria-label="Previous page"
      >
        <ChevronIcon direction="left" />
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className={`${dim} flex items-center justify-center font-mono text-xs text-muted-foreground`}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={isFetching}
            className={[
              `${dim} rounded-xl border font-mono text-xs transition-all disabled:cursor-not-allowed`,
              p === page
                ? 'bg-primary border-primary text-primary-foreground font-bold'
                : 'border-border bg-surface text-muted-foreground hover:text-surface-foreground hover:border-primary/40',
            ].join(' ')}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isFetching}
        className={`${dim} rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-surface-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all`}
        aria-label="Next page"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}