import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  PaginatedProducts,
  GetProductsResponse,
  SortOption,
} from '@/features/buyer/types/buyer.types';

interface UseDiscoverProductsParams {
  search: string;
  sort: SortOption;
  page: number;
}

export function useDiscoverProducts({ search, sort, page }: UseDiscoverProductsParams) {
  return useQuery<PaginatedProducts>({
    queryKey: ['discover-products', { search, sort, page }],
    queryFn: async () => {
      const params: Record<string, string | number> = { sort, page };
      if (search.trim().length > 0) params.search = search.trim();

      const { data } = await api.get<GetProductsResponse>('/products', { params });
      return data.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
}