'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiError {
  response?: { data?: { message?: string } };
}

interface ProductDraft {
  id: string;
}

interface SelectedFile {
  id: string;
  file: File;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ThumbnailUpload({
  preview,
  onChange,
}: {
  preview: string | null;
  onChange: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="block text-sm font-inter text-white/70 mb-2">
        Thumbnail <span className="text-white/30">(optional)</span>
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-40 rounded-xl border border-dashed border-[var(--border)] hover:border-brand/40 transition-colors bg-[var(--bg)] flex items-center justify-center overflow-hidden group"
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Thumbnail preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
              <span className="text-white text-xs font-inter">Change image</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/30">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs font-inter">Click to upload thumbnail</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
        }}
      />
    </div>
  );
}

function FileDropZone({
  files,
  onAdd,
  onRemove,
}: {
  files: SelectedFile[];
  onAdd: (incoming: File[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      if (dropped.length) onAdd(dropped);
    },
    [onAdd]
  );

  const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) onAdd(selected);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-inter text-white/70 mb-2">
        Digital files <span className="text-red-400">*</span>
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full rounded-xl border border-dashed transition-colors p-6 flex flex-col items-center gap-3 cursor-pointer ${
          isDragging
            ? 'border-brand bg-brand/5'
            : 'border-[var(--border)] hover:border-brand/40 bg-[var(--bg)]'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-inter text-white/60">
            <span className="text-brand">Browse files</span> or drag and drop
          </p>
          <p className="text-xs text-white/30 font-inter mt-1">
            PDF, ZIP, MP4, MP3, EPUB and more
          </p>
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleBrowse} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 bg-white/[0.03] border border-[var(--border)] rounded-xl px-4 py-3"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-inter truncate">{f.file.name}</p>
                <p className="text-xs text-white/30 font-mono">{formatFileSize(f.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(f.id);
                }}
                className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewProductPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [digitalFiles, setDigitalFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [submitStage, setSubmitStage] = useState<
    'idle' | 'creating' | 'uploading' | 'publishing'
  >('idle');

  // Step 1: create draft — POST /products
  const createDraft = useMutation({
    mutationFn: (payload: { title: string; price_cents: number; description?: string }) =>
      api
        .post<{ success: boolean; data: ProductDraft }>('/products', payload)
        .then((r) => r.data.data), // backend wraps: { success, data: { id, ... } }
  });

  // Step 2: upload a single digital file — POST /products/:productId/files
  const uploadFile = useMutation({
    mutationFn: ({ productId, file }: { productId: string; file: File }) => {
      const form = new FormData();
      form.append('file', file);
      return api.post(`/products/${productId}/files`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });

  // Step 3 (optional): upload thumbnail — PATCH /products/:productId
  const patchProduct = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: FormData }) =>
      api.patch(`/products/${productId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  });

  // Step 4 (optional): publish — POST /products/:productId/publish
  const publishProduct = useMutation({
    mutationFn: (productId: string) => api.post(`/products/${productId}/publish`),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

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

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price.');
      return;
    }
    if (digitalFiles.length === 0) {
      setError('Add at least one digital file.');
      return;
    }

    try {
      // 1. Create draft
      setSubmitStage('creating');
      const draft = await createDraft.mutateAsync({
        title: title.trim(),
        price_cents: Math.round(priceNum * 100),
        description: description.trim() || undefined,
      });

      // 2. Upload digital files sequentially
      setSubmitStage('uploading');
      for (const sf of digitalFiles) {
        await uploadFile.mutateAsync({ productId: draft.id, file: sf.file });
      }

      // 3. Upload thumbnail if provided
      if (thumbnailFile) {
        const form = new FormData();
        form.append('thumbnail', thumbnailFile);
        await patchProduct.mutateAsync({ productId: draft.id, data: form });
      }

      // 4. Publish if requested
      if (publish) {
        setSubmitStage('publishing');
        await publishProduct.mutateAsync(draft.id);
      }

      router.push('/products');
    } catch (err) {
      const msg =
        (err as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.';
      setError(msg);
      setSubmitStage('idle');
    }
  };

  const isSubmitting = submitStage !== 'idle';

  const stageLabel: Record<typeof submitStage, string> = {
    idle: '',
    creating: 'Creating product…',
    uploading: `Uploading files… (${digitalFiles.length})`,
    publishing: 'Publishing…',
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

        {/* Divider */}
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
            {isSubmitting && submitStage !== 'publishing' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {stageLabel[submitStage]}
              </>
            ) : (
              'Save as draft'
            )}
          </button>

          {/* Publish */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="flex-1 bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting && submitStage === 'publishing' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12m4.5-4.5V21"
                  />
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