// src/components/store/StorePagination.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface StorePaginationProps {
  page: number;
  totalPages: number;
}

function getPageWindow(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}

export default function StorePagination({ page, totalPages }: StorePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goTo = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(p));
      router.push(`?${params.toString()}`, { scroll: true });
    },
    [router, searchParams],
  );

  if (totalPages <= 1) return null;

  const window = getPageWindow(page, totalPages);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs transition-opacity disabled:opacity-30"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        aria-label="Previous page"
      >
        ‹
      </button>

      {window.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-8 w-8 items-center justify-center font-mono text-xs"
            style={{ color: 'var(--muted)' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs transition-colors"
            style={{
              borderColor: p === page ? 'var(--color-brand)' : 'var(--border)',
              color: p === page ? 'var(--color-brand)' : 'var(--muted)',
            }}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs transition-opacity disabled:opacity-30"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}