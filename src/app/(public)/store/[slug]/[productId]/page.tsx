// src/app/(public)/store/[slug]/[productId]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import api from '@/lib/api';
import CheckoutButton from '@/components/storefront/CheckoutButton';

interface ProductFile {
  id: string;
  name: string;
  size_bytes: number;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  status: string;
  files: ProductFile[];
  creator: {
    name: string;
    slug: string;
    avatar_url: string | null;
  };
}

interface PageProps {
  params: { slug: string; productId: string };
  searchParams: { ref?: string };
}

async function getProduct(productId: string): Promise<Product | null> {
  try {
    const res = await api.get<Product>(`/products/${productId}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.productId);
  if (!product) return { title: 'Product Not Found' };

  const formatNGN = (cents: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(cents / 100);

  return {
    title: `${product.title} — ${product.creator.name} | CreatorLock`,
    description: product.description ?? `Buy ${product.title} by ${product.creator.name} for ${formatNGN(product.price_cents)}`,
    openGraph: {
      title: product.title,
      description: product.description ?? `${formatNGN(product.price_cents)} · ${product.files.length} file(s)`,
      siteName: 'CreatorLock',
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const product = await getProduct(params.productId);

  if (!product || product.status !== 'published') {
    notFound();
  }

  const formatNGN = (cents: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(cents / 100);

  const isFree = product.price_cents === 0;
  const affiliateCode = searchParams.ref;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Link
            href={`/store/${params.slug}`}
            className="hover:text-white transition-colors"
          >
            {product.creator.name}
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{product.title}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left: product info */}
          <div className="md:col-span-3 space-y-6">
            {/* Creator info */}
            <div className="flex items-center gap-3">
              {product.creator.avatar_url ? (
                <img
                  src={product.creator.avatar_url}
                  alt={product.creator.name}
                  className="w-9 h-9 rounded-full object-cover border border-[var(--border)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center border border-[var(--border)]">
                  <span className="text-brand text-sm font-syne font-bold">
                    {product.creator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <Link
                href={`/store/${params.slug}`}
                className="text-sm text-[var(--muted)] hover:text-white transition-colors"
              >
                {product.creator.name}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-syne font-extrabold leading-tight">
              {product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* File count */}
            {product.files.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <svg
                  className="w-4 h-4 text-brand"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>
                  {product.files.length} {product.files.length === 1 ? 'file' : 'files'} included
                </span>
              </div>
            )}
          </div>

          {/* Right: purchase card */}
          <div className="md:col-span-2">
            <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-5 sticky top-8">
              {/* Price */}
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-widest mb-1">Price</p>
                <p className="font-mono text-3xl font-bold text-white">
                  {isFree ? 'Free' : formatNGN(product.price_cents)}
                </p>
              </div>

              <div className="border-t border-[var(--border)]" />

              {/* What you get */}
              <div className="space-y-2">
                <p className="text-xs text-[var(--muted)] uppercase tracking-widest">
                  What you get
                </p>
                <ul className="space-y-1.5">
                  {product.files.length > 0 ? (
                    product.files.map((file) => (
                      <li key={file.id} className="flex items-center gap-2 text-sm text-white">
                        <svg
                          className="w-3.5 h-3.5 text-brand shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="truncate">{file.name}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-[var(--muted)]">Digital download</li>
                  )}
                </ul>
              </div>

              {/* CTA */}
              <CheckoutButton
                productId={product.id}
                productTitle={product.title}
                priceCents={product.price_cents}
                isFree={isFree}
                affiliateCode={affiliateCode}
              />

              <p className="text-xs text-center text-[var(--muted)]">
                Secure checkout via Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}