import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductWithFiles } from '@/types/store';
import { formatNGN, formatDate } from '@/lib/utils';
import CheckoutButton from '@/components/checkout/CheckoutButton';
import CaptureAffiliateRef from '@/components/store/CaptureAffiliateRef';
import FileRow from '@/features/buyer/components/fileRow';
import PreviewSection from '../components/previewSection';

interface PageProps {
  params: Promise<{ slug: string; productId: string }>;
}

async function getProduct(productId: string): Promise<ProductWithFiles | null> {
  const url = `${process.env.NEXT_PUBLIC_URL}/products/${productId}`;
  console.log('[getProduct] fetching', url);

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (res.status === 404) {
      console.log('[getProduct] backend 404 for', productId);
      return null;
    }
    if (!res.ok) throw new Error(`Product fetch failed: ${res.status}`);

    const json = await res.json();
    if (!json.success) {
      console.log('[getProduct] backend success=false', json);
      return null;
    }
    return json.data as ProductWithFiles;
  } catch (err) {
    console.error('[getProduct] threw', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export default async function ProductPage({ params }: PageProps) {
  const { productId, slug } = await params;

  const product = await getProduct(productId);

  if (!product) notFound();

  const isFree = product.price_cents === 0;
  const hasFiles = product.files.length > 0;

  return (
    <main className="min-h-screen bg-background pb-20">
      <CaptureAffiliateRef />
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link
          href={`/store/${slug}`}
          className="inline-flex items-center gap-1.5 font-inter text-sm text-muted-foreground transition-colors hover:text-surface-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to store
        </Link>
      </div>

      <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

          <div className="flex flex-col gap-6">
            {product.thumbnail && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
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

            <div>
              <h1 className="font-syne text-2xl font-extrabold text-surface-foreground md:text-3xl">
                {product.title}
              </h1>
              <p className="mt-1 font-inter text-xs text-muted-foreground">
                Listed {formatDate(product.created_at)}
              </p>
            </div>

            {product.description && (
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h2 className="mb-3 font-syne text-sm font-bold text-surface-foreground">About this product</h2>
                <p className="whitespace-pre-wrap font-inter text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            <PreviewSection preview={product.preview} />
            {hasFiles && (
              <div>
                <h2 className="mb-3 font-syne text-sm font-bold text-surface-foreground">
                  What you&apos;ll get
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
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

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6">
              <div>
                <p className="mb-1 font-inter text-xs text-muted-foreground">Price</p>
                <p className="font-syne text-3xl font-extrabold text-surface-foreground">
                  {isFree ? (
                    <span className="text-primary">Free</span>
                  ) : (
                    formatNGN(product.price_cents)
                  )}
                </p>
              </div>

              {hasFiles && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-elevated px-3 py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="font-inter text-xs text-surface-foreground/70">
                    Includes {product.files.length} {product.files.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
              )}

              <CheckoutButton product={product} />

              <p className="text-center font-inter text-xs text-muted-foreground">
                Secure checkout · Instant delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}