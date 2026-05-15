'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { formatFileSize } from '@/lib/utils';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiError {
  response?: { data?: { message?: string } };
}

interface ProductFile {
  id: string;
  product_id: string;
  url: string;
  public_id: string;
  format: string | null;
  size: number | null;
  category: string | null;
  original_name: string | null;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price_cents: number;
  description?: string;
  thumbnail?: string;
  status: 'draft' | 'published' | 'unpublished' | 'flagged';
  files: ProductFile[];
}

interface NewFile {
  localId: string;
  file: File;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 10MB — must match backend

// ─── Sub-components ───────────────────────────────────────────────────────────

function ThumbnailUpload({
  currentUrl,
  preview,
  onChange,
}: {
  currentUrl?: string;
  preview: string | null;
  onChange: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const display = preview ?? currentUrl ?? null;

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
        {display ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={display}
              alt="Thumbnail"
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

      {/* Size hint */}
      <p className="mt-1.5 text-xs text-white/30 font-inter">
        JPG, PNG, WebP or GIF · Max 10MB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
          e.target.value = ''; // reset so same file can be reselected after error
        }}
      />
    </div>
  );
}

function FileDropZone({
  newFiles,
  onAdd,
  onRemove,
}: {
  newFiles: NewFile[];
  onAdd: (files: File[]) => void;
  onRemove: (localId: string) => void;
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
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full rounded-xl border border-dashed transition-colors p-5 flex flex-col items-center gap-2 cursor-pointer ${
          isDragging
            ? 'border-brand bg-brand/5'
            : 'border-[var(--border)] hover:border-brand/40 bg-[var(--bg)]'
        }`}
      >
        <svg
          className="w-6 h-6 text-white/30"
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
        <p className="text-sm font-inter text-white/50">
          <span className="text-brand">Browse</span> or drag files here
        </p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleBrowse} />
      </div>

      {newFiles.length > 0 && (
        <ul className="mt-3 space-y-2">
          {newFiles.map((nf) => (
            <li
              key={nf.localId}
              className="flex items-center gap-3 bg-brand/5 border border-brand/20 rounded-xl px-4 py-3"
            >
              <svg
                className="w-4 h-4 text-brand flex-shrink-0"
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
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-inter truncate">{nf.file.name}</p>
                <p className="text-xs text-white/30 font-mono">
                  {formatFileSize(nf.file.size)} · pending upload
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(nf.localId); }}
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
    </>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface ProductFormProps {
  product: Product;
  productId: string;
  onPublishToggle: () => void;
  isPublishing: boolean;
}

function ProductForm({ product, productId, onPublishToggle, isPublishing }: ProductFormProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price_cents / 100));
  const [description, setDescription] = useState(product.description ?? '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<NewFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saveStage, setSaveStage] = useState<'idle' | 'saving' | 'uploading'>('idle');

  const patchMutation = useMutation({
    mutationFn: (data: FormData) =>
      api.patch(`/products/${productId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product', productId] }),
  });

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return api.post(`/products/${productId}/files`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) =>
      api.delete(`/products/${productId}/files/${fileId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['product', productId] }),
  });

  const handleThumbnailChange = (file: File) => {
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError(
        `Thumbnail is too large. Max size is 10MB (yours is ${formatFileSize(file.size)}).`
      );
      return;
    }
    setError(null);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAddFiles = (files: File[]) => {
    const next: NewFile[] = files.map((f) => ({
      localId: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
      file: f,
    }));
    setNewFiles((prev) => [...prev, ...next]);
  };

  const handleRemoveNewFile = (localId: string) => {
    setNewFiles((prev) => prev.filter((f) => f.localId !== localId));
  };

  const handleSave = async () => {
    setError(null);

    if (!title.trim()) { setError('Title is required.'); return; }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum < 0) { setError('Enter a valid price.'); return; }

    try {
      setSaveStage('saving');

      const form = new FormData();
      form.append('title', title.trim());
      form.append('price_cents', String(Math.round(priceNum * 100)));
      if (description.trim()) form.append('description', description.trim());
      if (thumbnailFile) form.append('thumbnail', thumbnailFile);

      await patchMutation.mutateAsync(form);
      setThumbnailFile(null);
      setThumbnailPreview(null);

      if (newFiles.length > 0) {
        setSaveStage('uploading');
        for (const nf of newFiles) {
          await uploadFileMutation.mutateAsync(nf.file);
        }
        setNewFiles([]);
      }

      setSaveStage('idle');
    } catch (err) {
      console.error('[handleSave error]', err);
      setError(
        (err as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'
      );
      setSaveStage('idle');
    }
  };

  const isSaving = saveStage !== 'idle';
  const isPublished = product.status === 'published';

  const saveLabel =
    saveStage === 'saving' ? 'Saving…' :
    saveStage === 'uploading' ? 'Uploading files…' :
    'Save changes';

  return (
    <div className="space-y-6">
      {/* Status badge */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-inter font-medium ${
            product.status === 'published' ? 'bg-green-500/10 text-green-400' :
            product.status === 'unpublished' ? 'bg-brand/10 text-brand' :
            product.status === 'flagged' ? 'bg-red-500/10 text-red-400' :
            'bg-white/[0.06] text-white/40'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </div>

      {/* Publish / Unpublish */}
      {product.status !== 'flagged' && (
        <button
          type="button"
          disabled={isPublishing}
          onClick={onPublishToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-syne font-semibold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            isPublished
              ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white'
              : 'bg-brand hover:bg-brand-dark text-white'
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
          {isPublished ? 'Unpublish' : 'Publish'}
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
      />

      {/* Existing files */}
      <div>
        <label className="block text-sm font-inter text-white/70 mb-2">Digital files</label>
        {product.files.length === 0 && newFiles.length === 0 ? (
          <p className="text-sm text-white/30 font-inter mb-3">No files yet. Add files below.</p>
        ) : (
          <ul className="space-y-2 mb-3">
           {product.files.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 bg-white/[0.03] border border-[var(--border)] rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  {/* filename → original_name, with fallback */}
                  <p className="text-sm text-white font-inter truncate">
                    {f.original_name ?? f.public_id}
                  </p>
                  {/* size_bytes → size */}
                  <p className="text-xs text-white/30 font-mono">
                    {f.size ? formatFileSize(f.size) : 'Unknown size'}
                    {f.category && <span className="ml-2 opacity-60">{f.category}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
  
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-white/30 hover:text-brand transition-colors"
                    title="View file"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>

                
                  <button
                    type="button"
                    disabled={deleteFileMutation.isPending}
                    onClick={() => deleteFileMutation.mutate(f.id)}
                    className="text-white/30 hover:text-red-400 disabled:opacity-40 transition-colors"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <FileDropZone newFiles={newFiles} onAdd={handleAddFiles} onRemove={handleRemoveNewFile} />
      </div>

      {/* Divider */}
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

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () =>
      api.get(`/products/${productId}`).then((r) => {
        const d = r.data;
        return d?.data ?? d;
      }),
    enabled: !!productId,
  });

  const publishMutation = useMutation({
    mutationFn: (action: 'publish' | 'unpublish') =>
      api.post(`/products/${productId}/${action}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['product', productId] }),
  });

  const handleTogglePublish = () => {
    if (!product) return;
    const action = product.status === 'published' ? 'unpublish' : 'publish';
    publishMutation.mutate(action);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-[var(--muted)] font-inter text-sm">
          Product not found or you don&#39;t have access.
        </p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 text-brand hover:underline font-inter text-sm"
        >
          Back to products
        </button>
      </div>
    );
  }

 
console.log('files:', product.files)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-1.5 text-[var(--muted)] hover:text-white font-inter text-sm transition-colors mb-2"
          >
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
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