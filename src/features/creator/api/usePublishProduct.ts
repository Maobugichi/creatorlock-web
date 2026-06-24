import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { productKey } from './useProduct';

export function usePublishProduct(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: 'publish' | 'unpublish') =>
      api.post(`/products/${productId}/${action}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKey(productId) }),
  });
}