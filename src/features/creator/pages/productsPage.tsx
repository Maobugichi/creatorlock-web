"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts, useToggleProduct } from "../api/useProducts";
import { useToast } from "../hooks/useToast";
import { filterAndSort, buildCounts } from "../utils/product.utils";
import { ToastContainer } from "../component/toast";
import FilterSortBar from "../component/filterSortBar";
import ProductCard from "../component/productCard";
import ProductCardSkeleton from "../component/productCardSkeleton";
import ProductsError from "../component/productError";
import ProductsEmpty from "../component/productsEmpty";
import type { FilterStatus, SortOption, ProductStatus } from "../types/product.types";

export default function ProductsPage() {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const { toasts, dismiss, show: showToast } = useToast();
  const { data: products, isLoading, isError, refetch } = useProducts();

  const toggleMutation = useToggleProduct({
    onMutate: (id) => setTogglingId(id),
    onSuccess: (action) => {
      showToast(
        action === "publish" ? "Product published" : "Product unpublished",
        action === "publish" ? "success" : "info",
        action === "publish"
          ? "Your product is now live in your store."
          : "Your product has been hidden from your store."
      );
    },
    onError: (message) => showToast(message, "error"),
    onSettled: () => setTogglingId(null),
  });

  function handleToggle(id: string, currentStatus: ProductStatus) {
    const action = currentStatus === "published" ? "unpublish" : "publish";
    toggleMutation.mutate({ id, action });
  }

  const filteredAndSorted = filterAndSort(products ?? [], filter, sort);
  const counts = buildCounts(products ?? []);

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-syne font-extrabold text-surface-foreground text-2xl">Products</h1>
            {!isLoading && !isError && products && (
              <p className="font-inter text-muted-foreground text-sm mt-0.5">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>
          <Link
            href="/products/new"
            className="bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl transition-all flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 sm:text-sm"
            aria-label="New product"
          >
            <span className="text-lg leading-none sm:hidden">+</span>
            <span className="hidden sm:inline">+ New product</span>
          </Link>
        </div>

        {isError && <ProductsError onRetry={refetch} />}

        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && products && (
          <>
            {products.length === 0 ? (
              <ProductsEmpty filtered={false} />
            ) : (
              <>
                <FilterSortBar
                  filter={filter}
                  sort={sort}
                  onFilterChange={setFilter}
                  onSortChange={setSort}
                  counts={counts}
                />

                {filteredAndSorted.length === 0 ? (
                  <ProductsEmpty filtered={true} />
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAndSorted.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onToggle={handleToggle}
                        isToggling={togglingId === product.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}