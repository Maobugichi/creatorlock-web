import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  PaginatedProducts,
  GetProductsResponse,
  SortOption,
  ProductCategory,
} from '@/features/buyer/types/buyer.types';

interface UseDiscoverProductsParams {
  search: string;
  sort: SortOption;
  category: ProductCategory | null;
  page: number;
}

export function useDiscoverProducts({ search, sort,  category, page }: UseDiscoverProductsParams) {
  return useQuery<PaginatedProducts>({
    queryKey: ['discover-products', { search, sort, category, page }],
    queryFn: async () => {
      const params: Record<string, string | number> = { sort, page };
      if (search.trim().length > 0) params.search = search.trim();
      if (category) params.category = category;

      const { data } = await api.get<GetProductsResponse>('/products', { params });
      return data.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
}