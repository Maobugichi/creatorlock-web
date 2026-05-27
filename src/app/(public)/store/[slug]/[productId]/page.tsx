import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductWithFiles, ProductFile } from '@/types/store';
import { formatNGN, formatFileSize, formatDate } from '@/lib/utils';
import CheckoutButton from '@/components/checkout/CheckoutButton';


async function getProduct(productId: string): Promise<ProductWithFiles | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/products/${productId}`,
      { next: { revalidate: 60 } },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);
    const json = await res.json();
    if (!json.success) return null;
    return json.data as ProductWithFiles;
  } catch {
    return null;
  }
}

// ── generateMetadata ──────────────────────────
export async function generateMetadata(
   { params }: { params: Promise<{ slug: string; productId: string }> },
): Promise<Metadata> {
   const { productId } = await params;

  const product = await getProduct(productId);
  if (!product) return { title: 'Product not found — CreatorLock' };

  const title = `${product.title} — CreatorLock`;
  const description = product.description ?? `Buy ${product.title} on CreatorLock.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.thumbnail
        ? [{ url: product.thumbnail, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card: product.thumbnail ? 'summary_large_image' : 'summary',
      title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

// ── File list row ─────────────────────────────
function FileRow({ file }: { file: ProductFile }) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ color: 'var(--muted)' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="truncate font-inter text-sm text-white/80">
          {file.original_name ?? file.url.split('/').pop() ?? 'File'}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {file.format && (
          <span className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            {file.format}
          </span>
        )}
        {file.size !== null && (
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            {formatFileSize(file.size)}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────
export default async function ProductPage(
 { params }: { params: Promise<{ slug: string; productId: string }> },
) {

  const { productId, slug } = await params

  const product = await getProduct(productId);
  if (!product) notFound();

  const isFree = product.price_cents === 0;
  const hasFiles = product.files.length > 0;

  return (
    <main className="min-h-screen pb-20" style={{ background: 'var(--bg)' }}>
     
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link
          href={`/store/${slug}`}
          className="inline-flex items-center gap-1.5 font-inter text-sm transition-colors hover:text-white"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to store
        </Link>
      </div>

      {/* ── Main content grid ─────────────────── */}
      <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

          {/* ── LEFT: product info ─────────────── */}
          <div className="flex flex-col gap-6">
            {/* Thumbnail */}
            {product.thumbnail && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="font-syne text-2xl font-extrabold text-white md:text-3xl">
                {product.title}
              </h1>
              <p className="mt-1 font-inter text-xs" style={{ color: 'var(--muted)' }}>
                Listed {formatDate(product.created_at)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div
                className="rounded-2xl border p-5"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="mb-3 font-syne text-sm font-bold text-white">About this product</h2>
                <p className="whitespace-pre-wrap font-inter text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* File list */}
            {hasFiles && (
              <div>
                <h2 className="mb-3 font-syne text-sm font-bold text-white">
                  What you&apos;ll get
                  <span className="ml-2 font-mono text-xs font-normal" style={{ color: 'var(--muted)' }}>
                    {product.files.length} {product.files.length === 1 ? 'file' : 'files'}
                  </span>
                </h2>
                <div className="flex flex-col gap-2">
                  {product.files.map((file) => (
                    <FileRow key={file.id} file={file} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: purchase card ──────────── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div
              className="flex flex-col gap-5 rounded-2xl border p-6"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
            >
              {/* Price */}
              <div>
                <p className="mb-1 font-inter text-xs" style={{ color: 'var(--muted)' }}>Price</p>
                <p className="font-syne text-3xl font-extrabold text-white">
                  {isFree ? (
                    <span style={{ color: '#10b981' }}>Free</span>
                  ) : (
                    formatNGN(product.price_cents)
                  )}
                </p>
              </div>

              {/* File count summary */}
              {hasFiles && (
                <div
                  className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
                  style={{ borderColor: 'var(--border)', background: '#0C0C0C' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-brand)' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="font-inter text-xs text-white/70">
                    Includes {product.files.length} {product.files.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
              )}

              {/* Checkout button — Client Component */}
              <CheckoutButton product={product} />

              {/* Trust note */}
              <p className="text-center font-inter text-xs" style={{ color: 'var(--muted)' }}>
                Secure checkout · Instant delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}