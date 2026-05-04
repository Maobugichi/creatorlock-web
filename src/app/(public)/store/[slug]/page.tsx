import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCard, { type StorefrontProduct } from "@/components/storefront/ProductCard";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

interface CreatorStore {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string | null;
  banner_url?: string | null;
  slug: string;
  social_links?: SocialLinks;
  is_active: boolean;
  products: StorefrontProduct[];
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getStore(slug: string): Promise<CreatorStore | null> {
  try {
    const res = await api.get(`/creator/store/${slug}`);
    const payload = res.data;
    // Handle both bare object and { data: ... } shaped responses
    return payload?.data ?? payload;
  } catch {
    return null;
  }
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const store = await getStore(params.slug);
  if (!store) {
    return { title: "Store not found — CreatorLock" };
  }

  return {
    title: `${store.display_name} — CreatorLock`,
    description: store.bio ?? `Buy digital products from ${store.display_name} on CreatorLock.`,
    openGraph: {
      title: `${store.display_name} — CreatorLock`,
      description: store.bio ?? `Buy digital products from ${store.display_name}.`,
      ...(store.avatar_url && { images: [{ url: store.avatar_url }] }),
    },
  };
}

// ─── Store Header ─────────────────────────────────────────────────────────────

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-[var(--muted)] hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

function StoreHeader({ store }: { store: CreatorStore }) {
  const links = store.social_links ?? {};

  return (
    <div className="mb-12">
      {/* Banner */}
      <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-0 relative">
        {store.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.banner_url}
            alt={`${store.display_name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          // Gradient fallback using brand colours
          <div className="w-full h-full bg-gradient-to-br from-brand/30 via-[#1a0a00] to-[var(--bg)]" />
        )}
      </div>

      {/* Avatar + info row */}
      <div className="px-2 md:px-0 -mt-12 flex items-end gap-5">
        <div className="w-24 h-24 rounded-2xl border-4 border-[var(--bg)] overflow-hidden bg-surface flex-shrink-0 flex items-center justify-center">
          {store.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.avatar_url}
              alt={store.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-syne font-extrabold text-white/20">
              {store.display_name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="pb-1 flex-1 min-w-0">
          <h1 className="font-syne font-extrabold text-white text-xl md:text-2xl leading-tight truncate">
            {store.display_name}
          </h1>
          {store.bio && (
            <p className="font-inter text-[var(--muted)] text-sm mt-1 line-clamp-2">
              {store.bio}
            </p>
          )}
        </div>
      </div>

      {/* Social links */}
      {Object.values(links).some(Boolean) && (
        <div className="flex items-center gap-4 mt-4 px-2 md:px-0">
          {links.twitter && (
            <SocialIcon href={`https://twitter.com/${links.twitter.replace("@", "")}`} label="Twitter/X">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.002 2.25h6.957l4.265 5.632 5.02-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
          )}
          {links.instagram && (
            <SocialIcon href={`https://instagram.com/${links.instagram.replace("@", "")}`} label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </SocialIcon>
          )}
          {links.youtube && (
            <SocialIcon href={links.youtube} label="YouTube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </SocialIcon>
          )}
          {links.website && (
            <SocialIcon href={links.website} label="Website">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12a8.959 8.959 0 011.716-5.253" />
              </svg>
            </SocialIcon>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  const store = await getStore(params.slug);

  if (!store || !store.is_active) {
    notFound();
  }

  const publishedProducts = store.products.filter((p) => true); // backend returns only published for public endpoint

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <StoreHeader store={store} />

        {/* Products section */}
        <section>
          <h2 className="font-syne font-bold text-white text-lg mb-6">
            {publishedProducts.length > 0
              ? `${publishedProducts.length} ${publishedProducts.length === 1 ? "product" : "products"}`
              : "Products"}
          </h2>

          {publishedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                className="mb-4 opacity-20"
                aria-hidden="true"
              >
                <rect x="8" y="16" width="48" height="36" rx="5" stroke="white" strokeWidth="2" />
                <path d="M20 16v-3a12 12 0 0 1 24 0v3" stroke="white" strokeWidth="2" />
              </svg>
              <p className="font-syne font-bold text-white text-base mb-1">No products yet</p>
              <p className="font-inter text-[var(--muted)] text-sm">
                {store.display_name} hasn&apos;t published anything yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedProducts.map((product) => (
                <ProductCard key={product.id} product={product} slug={params.slug} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}