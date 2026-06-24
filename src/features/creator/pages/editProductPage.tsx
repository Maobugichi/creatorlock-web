"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct, usePublishToggle } from "../api/useEditProduct";
import ProductForm from "../component/productForm";
import EditProductSkeleton from "../component/editProductSkeleton";
import EditProductError from "../component/editProductError";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const router = useRouter();

  const { data: product, isLoading, isError } = useProduct(productId);

  const publishMutation = usePublishToggle(productId);

  const handleTogglePublish = () => {
    if (!product) return;
    const action = product.status === "published" ? "unpublish" : "publish";
    publishMutation.mutate(action);
  };

  if (isLoading) return <EditProductSkeleton />;
  if (isError || !product) return <EditProductError onBack={() => router.push("/products")} />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-1.5 text-[var(--muted)] hover:text-white font-inter text-sm transition-colors mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Products
          </button>
          <h1 className="font-syne font-extrabold text-white text-2xl">Edit product</h1>
        </div>
      </div>

      <ProductForm
        key={product.id}
        product={product}
        productId={productId}
        onPublishToggle={handleTogglePublish}
        isPublishing={publishMutation.isPending}
      />
    </div>
  );
}