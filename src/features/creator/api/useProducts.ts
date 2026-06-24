import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, ProductStatus, ApiError } from "../types/product.types";

// ─── Query ────────────────────────────────────────────────────────────────────

export function useProducts() {
  return useQuery<Product[], ApiError>({
    queryKey: ["products", "me"],
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        data: { products: Product[]; total: number; page: number; totalPages: number };
      }>("/products/me");
      return res.data.data.products;
    },
    retry: 1,
  });
}

// ─── Mutation ─────────────────────────────────────────────────────────────────

interface ToggleArgs {
  id: string;
  action: "publish" | "unpublish";
}

interface ToggleCallbacks {
  onSuccess: (action: "publish" | "unpublish") => void;
  onError: (message: string) => void;
  onMutate: (id: string) => void;
  onSettled: () => void;
}

export function useToggleProduct({
  onSuccess,
  onError,
  onMutate: onMutateCallback,
  onSettled,
}: ToggleCallbacks) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, ToggleArgs, { previous: Product[] | undefined }>({
    mutationFn: async ({ id, action }) => {
      await api.post(`/products/${id}/${action}`);
    },
    onMutate: async ({ id, action }) => {
      onMutateCallback(id);
      await queryClient.cancelQueries({ queryKey: ["products", "me"] });
      const previous = queryClient.getQueryData<Product[]>(["products", "me"]);
      queryClient.setQueryData<Product[]>(["products", "me"], (old) =>
        old?.map((p) =>
          p.id === id
            ? { ...p, status: (action === "publish" ? "published" : "unpublished") as ProductStatus }
            : p
        )
      );
      return { previous };
    },
    onSuccess: (_, { action }) => {
      onSuccess(action);
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["products", "me"], context.previous);
      }
      const message = err?.response?.data?.message ?? "Something went wrong";
      onError(message);
    },
    onSettled: () => {
      onSettled();
      queryClient.invalidateQueries({ queryKey: ["products", "me"] });
    },
  });
}