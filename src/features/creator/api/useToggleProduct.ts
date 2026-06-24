import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PRODUCTS_KEY } from './useProducts';
import type { Product, ProductStatus, ApiError } from '../types/product.types';

interface TogglePayload {
  id: string;
  action: 'publish' | 'unpublish';
}

interface UseToggleProductOptions {
  onSuccess?: (action: 'publish' | 'unpublish') => void;
  onError?: (message: string) => void;
  onSettled?: (id: string) => void;
}

export function useToggleProduct({ onSuccess, onError, onSettled }: UseToggleProductOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    TogglePayload,
    { previous: Product[] | undefined }
  >({
    mutationFn: async ({ id, action }) => {
      await api.post(`/products/${id}/${action}`);
    },
    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      const previous = queryClient.getQueryData<Product[]>(PRODUCTS_KEY);
      queryClient.setQueryData<Product[]>(PRODUCTS_KEY, (old) =>
        old?.map((p) =>
          p.id === id
            ? { ...p, status: (action === 'publish' ? 'published' : 'unpublished') as ProductStatus }
            : p
        )
      );
      return { previous };
    },
    onSuccess: (_, { action }) => {
      onSuccess?.(action);
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(PRODUCTS_KEY, context.previous);
      }
      onError?.(err?.response?.data?.message ?? 'Something went wrong');
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      onSettled?.(id);
    },
  });
}