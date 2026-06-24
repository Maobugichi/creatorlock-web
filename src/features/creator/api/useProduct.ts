import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ProductDetail } from '../types/product.types';

export const productKey = (id: string) => ['product', id] as const;

export function useProduct(productId: string) {
  return useQuery<ProductDetail>({
    queryKey: productKey(productId),
    queryFn: () =>
      api.get(`/products/${productId}`).then((r) => {
        const d = r.data;
        return d?.data ?? d;
      }),
    enabled: !!productId,
  });
}