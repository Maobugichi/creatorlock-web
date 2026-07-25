import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ProductCategory, ProductDraft } from "../types/product.types";

// ─── Step 1: Create draft ─────────────────────────────────────────────────────

interface CreateDraftPayload {
  title: string;
  price_cents: number;
  description?: string;
  category?: ProductCategory;
}

export function useCreateDraft() {
  return useMutation({
    mutationFn: (payload: CreateDraftPayload) =>
      api
        .post<{ success: boolean; data: ProductDraft }>("/products", payload)
        .then((r) => r.data.data),
  });
}



export function useUploadFile() {
  return useMutation({
    mutationFn: ({
      productId,
      file,
      isPreview,
    }: {
      productId: string;
      file: File;
      isPreview?: boolean;
    }) => {
      const form = new FormData();
      form.append("file", file);
      if (isPreview) form.append("isPreview", "true");
      return api.post(`/products/${productId}/files`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}

// ─── Step 3: Upload thumbnail ─────────────────────────────────────────────────

export function usePatchProduct() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: FormData }) =>
      api.patch(`/products/${productId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });
}

// ─── Step 4: Publish ──────────────────────────────────────────────────────────

export function usePublishProduct() {
  return useMutation({
    mutationFn: (productId: string) => api.post(`/products/${productId}/publish`),
  });
}