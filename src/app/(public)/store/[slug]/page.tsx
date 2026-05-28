
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { StoreData } from '@/types/store';
import StoreHeader from '@/components/store/StoreHeader';
import ProductGrid from '@/components/store/ProductGrid';
import CaptureAffiliateRef from '@/components/store/CaptureAffiliateRef';

// ── Server-side data fetch ────────────────────
// Route: GET /store/:slug  (no /creator prefix)
// Base:  NEXT_PUBLIC_URL=http://localhost:3000/api  → /api/store/:slug
// Response envelope: { success: true, data: { profile, products, total, page, limit, totalPages } }
async function getStoreData(slug: string): Promise<StoreData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/store/${slug}`,
      { next: { revalidate: 60 } },
    );

   

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Store fetch failed: ${res.status}`);

    const json = await res.json();

   
    // Backend wraps in { success, data }
    if (!json.success) return null;
    return json.data as StoreData;
  } catch {
    return null;
  }
}

// ── generateMetadata ──────────────────────────
export async function generateMetadata(
 { params }: { params: Promise<{ slug: string; }> },
): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) return { title: 'Store not found — CreatorLock' };

  const { profile } = data;
  const title = `${profile.display_name} — CreatorLock`;
  const description =
    profile.bio ??
    `Browse and buy digital products from ${profile.display_name} on CreatorLock.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: profile.banner_image
        ? [{ url: profile.banner_image, width: 1200, height: 630, alt: title }]
        : profile.profile_image
        ? [{ url: profile.profile_image, width: 400, height: 400, alt: profile.display_name }]
        : [],
    },
    twitter: {
      card: profile.banner_image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: profile.banner_image
        ? [profile.banner_image]
        : profile.profile_image
        ? [profile.profile_image]
        : [],
    },
  };
}

// ── Page ─────────────────────────────────────
export default async function StorePage(
 { params }: { params: Promise<{ slug: string; }> },
) {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) notFound();

  const { profile, products, total } = data;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <CaptureAffiliateRef />
      <StoreHeader profile={profile} productCount={total} />
      <ProductGrid products={products} storeSlug={slug} total={total} />
    </main>
  );
}