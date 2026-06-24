import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ProductDraft } from '../types/product.types';

export function useCreateDraft() {
  return useMutation({
    mutationFn: (payload: { title: string; price_cents: number; description?: string }) =>
      api
        .post<{ success: boolean; data: ProductDraft }>('/products', payload)
        .then((r) => r.data.data),
  });
}

export function useUploadProductFile(productId: string) {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return api.post(`/products/${productId}/files`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });
}

export function usePatchProduct(productId: string) {
  return useMutation({
    mutationFn: (data: FormData) =>
      api.patch(`/products/${productId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  });
}

export function usePublishNewProduct(productId: string) {
  return useMutation({
    mutationFn: () => api.post(`/products/${productId}/publish`),
  });
}