"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateDraft, useUploadFile, usePatchProduct, usePublishProduct } from "../api/useNewProduct";
import ThumbnailUpload from "../component/thumbnailUpload";
import FileDropZone from "../component/fileDropZone";
import type { SelectedFile, SubmitStage, ApiError } from "../types/product.types";
import type { Product, ProductStatus } from "@/types/store";
import type { ProductCategory } from "../types/product.types";
import { CATEGORY_OPTIONS } from "../types/product.types";
import PreviewUpload from "../component/productPreview";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [digitalFiles, setDigitalFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitStage, setSubmitStage] = useState<SubmitStage>("idle");
  const [category, setCategory] = useState<ProductCategory>("other");
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const createDraft = useCreateDraft();
  const uploadFile = useUploadFile();
  const patchProduct = usePatchProduct();
  const publishProduct = usePublishProduct();

  const handleThumbnailChange = (file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAddFiles = (incoming: File[]) => {
    const next: SelectedFile[] = incoming.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
    }));
    setDigitalFiles((prev) => [...prev, ...next]);
  };

  const handleRemoveFile = (id: string) => {
    setDigitalFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = async (publish: boolean) => {
    setError(null);

    if (!title.trim()) { setError("Title is required."); return; }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum < 0) { setError("Enter a valid price."); return; }
    if (digitalFiles.length === 0) { setError("Add at least one digital file."); return; }

    try {
      
      setSubmitStage("creating");
      const draft = await createDraft.mutateAsync({
        title: title.trim(),
        price_cents: Math.round(priceNum * 100),
        description: description.trim() || undefined,
        category,
      });

    
      setSubmitStage("uploading");
      for (const sf of digitalFiles) {
        await uploadFile.mutateAsync({ productId: draft.id, file: sf.file });
      }

     

      if (previewFile) {
        await uploadFile.mutateAsync({ productId: draft.id, file: previewFile, isPreview: true });
      }

      
      if (thumbnailFile) {
        const form = new FormData();
        form.append("thumbnail", thumbnailFile);
        await patchProduct.mutateAsync({ productId: draft.id, data: form });
      }

   
      if (publish) {
        setSubmitStage("publishing");
        await publishProduct.mutateAsync(draft.id);
      }

    
      queryClient.setQueryData<Product[]>(["products", "me"], (old) => [
        {
          id: draft.id,
          title: title.trim(),
          price_cents: Math.round(priceNum * 100),
          status: (publish ? "published" : "draft") as ProductStatus,
          thumbnail: thumbnailPreview ?? null,
          category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          creator_id: "",
          slug: "",
          description: description.trim() || null,
        },
        ...(old ?? []),
      ]);

      router.push("/products");
    } catch (err) {
      const msg = (err as ApiError)?.response?.data?.message ?? "Something went wrong. Try again.";
      setError(msg);
      setSubmitStage("idle");
    }
  };

  const isSubmitting = submitStage !== "idle";

  const stageLabel: Record<SubmitStage, string> = {
    idle: "",
    creating: "Creating product…",
    uploading: `Uploading files… (${digitalFiles.length})`,
    publishing: "Publishing…",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-syne font-extrabold text-white text-2xl">New product</h1>
        <p className="text-[var(--muted)] font-inter text-sm mt-1">
          Fill in the details, upload your files, then save as draft or publish.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-inter">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-inter text-white/70 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ultimate Notion Finance Template"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-white font-inter text-sm placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-inter text-white/70 mb-2">
            Price <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm select-none">
              ₦
            </span>
            <input
              id="price"
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5000"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-8 pr-4 py-3 text-white font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors"
            />
          </div>
          <p className="mt-1.5 text-xs text-white/30 font-inter">
            Enter amount in naira. Set 0 for a free product.
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-inter text-white/70 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-white font-inter text-sm focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--bg)]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-inter text-white/70 mb-2">
            Description <span className="text-white/30">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What's included? Who is this for?"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-white font-inter text-sm placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors resize-none"
          />
        </div>

        {/* Thumbnail */}
        <ThumbnailUpload preview={thumbnailPreview} onChange={handleThumbnailChange} />

        {/* Digital files */}
        <FileDropZone files={digitalFiles} onAdd={handleAddFiles} onRemove={handleRemoveFile} />

        <PreviewUpload
          file={previewFile}
          onChange={setPreviewFile}
          onRemove={() => setPreviewFile(null)}
        />

        <div className="border-t border-[var(--border)]" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Save as draft */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting && submitStage !== "publishing" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {stageLabel[submitStage]}
              </>
            ) : (
              "Save as draft"
            )}
          </button>

          {/* Publish */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="flex-1 bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting && submitStage === "publishing" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12m4.5-4.5V21" />
                </svg>
                Publish now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}