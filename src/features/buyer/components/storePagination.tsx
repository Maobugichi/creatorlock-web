// features/buyer/components/storePagination.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Pagination } from '@/features/shared/component/pagination';

interface StorePaginationProps {
  page: number;
  totalPages: number;
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

  return <Pagination page={page} totalPages={totalPages} onPageChange={goTo} size="sm" />;
}