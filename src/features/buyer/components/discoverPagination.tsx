// features/buyer/components/discoverPagination.tsx
import { Pagination } from '@/features/shared/component/pagination';

interface DiscoverPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching: boolean;
}

export function DiscoverPagination(props: DiscoverPaginationProps) {
  return <Pagination {...props} size="lg" />;
}