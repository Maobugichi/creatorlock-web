import { ChevronIcon } from '@/features/buyer/components/icons';

interface DiscoverPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching: boolean;
}

export function DiscoverPagination({ page, totalPages, onPageChange, isFetching }: DiscoverPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if ((i === page - delta - 1 && i > 1) || (i === page + delta + 1 && i < totalPages)) {
      pages.push('ellipsis');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isFetching}
        className="w-11 h-11 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-surface-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronIcon direction="left" />
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="w-11 h-11 flex items-center justify-center font-mono text-xs text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={isFetching}
            className={[
              'w-11 h-11 rounded-xl border font-mono text-xs transition-all disabled:cursor-not-allowed',
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
        className="w-11 h-11 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-surface-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}