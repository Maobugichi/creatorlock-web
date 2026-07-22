"use client";

import { useState } from "react";
import { formatFileSize } from "@/lib/utils";
import { usePatchEditProduct, useUploadEditFile, useDeleteFile } from "../api/useEditProduct";
import ThumbnailUpload from "./thumbnailUpload";
import FileDropZone from "./fileDropZone";
import ExistingFileList from "./existingFileList";
import type { EditProduct, SelectedFile, SaveStage, ApiError } from "../types/product.types";
import type { ProductCategory } from "../types/product.types";
import { CATEGORY_OPTIONS } from "../types/product.types";


const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; 

interface ProductFormProps {
  product: EditProduct;
  productId: string;
  onPublishToggle: () => void;
  isPublishing: boolean;
}

export default function ProductForm({
  product,
  productId,
  onPublishToggle,
  isPublishing,
}: ProductFormProps) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price_cents / 100));
  const [description, setDescription] = useState(product.description ?? "");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saveStage, setSaveStage] = useState<SaveStage>("idle");
  const [category, setCategory] = useState<ProductCategory>(product.category ?? "other");

  const patchMutation = usePatchEditProduct(productId);
  const uploadFileMutation = useUploadEditFile(productId);
  const deleteFileMutation = useDeleteFile(productId);

  const handleThumbnailChange = (file: File) => {
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError(`Thumbnail is too large. Max size is 10MB (yours is ${formatFileSize(file.size)}).`);
      return;
    }
    setError(null);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAddFiles = (files: File[]) => {
    const next: SelectedFile[] = files.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
      file: f,
    }));
    setNewFiles((prev) => [...prev, ...next]);
  };

  const handleRemoveNewFile = (id: string) => {
    setNewFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    setError(null);

    if (!title.trim()) { setError("Title is required."); return; }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum < 0) { setError("Enter a valid price."); return; }

    try {
      setSaveStage("saving");

      const form = new FormData();
      form.append("title", title.trim());
      form.append("price_cents", String(Math.round(priceNum * 100)));
      form.append("category", category);
      if (description.trim()) form.append("description", description.trim());
      if (thumbnailFile) form.append("thumbnail", thumbnailFile);

      await patchMutation.mutateAsync(form);
      setThumbnailFile(null);
      setThumbnailPreview(null);

      if (newFiles.length > 0) {
        setSaveStage("uploading");
        for (const sf of newFiles) {
          await uploadFileMutation.mutateAsync(sf.file);
        }
        setNewFiles([]);
      }

      setSaveStage("idle");
    } catch (err) {
      setError((err as ApiError)?.response?.data?.message ?? "Something went wrong. Try again.");
      setSaveStage("idle");
    }
  };

  const isSaving = saveStage !== "idle";
  const isPublished = product.status === "published";

  const saveLabel =
    saveStage === "saving" ? "Saving…" :
    saveStage === "uploading" ? "Uploading files…" :
    "Save changes";

  return (
    <div className="space-y-6">
      {/* Status badge */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-inter font-medium ${
            product.status === "published" ? "bg-green-500/10 text-green-400" :
            product.status === "unpublished" ? "bg-brand/10 text-brand" :
            product.status === "flagged" ? "bg-red-500/10 text-red-400" :
            "bg-white/[0.06] text-white/40"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </div>

      {/* Publish / Unpublish */}
      {product.status !== "flagged" && (
        <button
          type="button"
          disabled={isPublishing}
          onClick={onPublishToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-syne font-semibold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            isPublished
              ? "bg-white/[0.06] hover:bg-white/[0.1] text-white"
              : "bg-brand hover:bg-brand-dark text-white"
          }`}
        >
          {isPublishing ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isPublished ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12m4.5-4.5V21" />
            </svg>
          )}
          {isPublished ? "Unpublish" : "Publish"}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-inter">
          {error}
        </div>
      )}

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
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-8 pr-4 py-3 text-white font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors"
          />
        </div>
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
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-white font-inter text-sm placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors resize-none"
        />
      </div>

      {/* Thumbnail */}
      <ThumbnailUpload
        currentUrl={product.thumbnail}
        preview={thumbnailPreview}
        onChange={handleThumbnailChange}
        showSizeHint
      />

      {/* Files */}
      <div>
        <label className="block text-sm font-inter text-white/70 mb-2">Digital files</label>
        {product.files.length === 0 && newFiles.length === 0 ? (
          <p className="text-sm text-white/30 font-inter mb-3">No files yet. Add files below.</p>
        ) : (
          <ExistingFileList
            files={product.files}
            onDelete={(fileId) => deleteFileMutation.mutate(fileId)}
            isDeleting={deleteFileMutation.isPending}
          />
        )}
        <FileDropZone
          files={newFiles}
          onAdd={handleAddFiles}
          onRemove={handleRemoveNewFile}
        />
      </div>

      <div className="border-t border-[var(--border)]" />

      {/* Save */}
      <button
        type="button"
        disabled={isSaving}
        onClick={handleSave}
        className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm flex items-center justify-center gap-2"
      >
        {isSaving && (
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {saveLabel}
      </button>
    </div>
  );
}