import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { EditProduct } from "../types/product.types";

// ─── Query ────────────────────────────────────────────────────────────────────

export function useProduct(productId: string) {
  return useQuery<EditProduct>({
    queryKey: ["product", productId],
    queryFn: () =>
      api.get(`/products/${productId}`).then((r) => {
        const d = r.data;
        return d?.data ?? d;
      }),
    enabled: !!productId,
  });
}

// ─── Patch (title, price, description, thumbnail) ─────────────────────────────

export function usePatchEditProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      api.patch(`/products/${productId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["product", productId] }),
  });
}

export function useUploadEditFile(productId: string) {
  return useMutation({
    mutationFn: ({ file, isPreview }: { file: File; isPreview?: boolean }) => {
      const form = new FormData();
      form.append("file", file);
      if (isPreview) form.append("isPreview", "true");
      return api.post(`/products/${productId}/files`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}
// ─── Delete existing digital file ────────────────────────────────────────────

export function useDeleteFile(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) =>
      api.delete(`/products/${productId}/files/${fileId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["product", productId] }),
  });
}

// ─── Publish / Unpublish ──────────────────────────────────────────────────────

export function usePublishToggle(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: "publish" | "unpublish") =>
      api.post(`/products/${productId}/${action}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["product", productId] }),
  });
}