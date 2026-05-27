// ─────────────────────────────────────────────
//  CreatorLock — StoreHeader
//  src/components/store/StoreHeader.tsx
//  Server Component — no 'use client'
//  Fields: CreatorProfile from creator_profiles table
// ─────────────────────────────────────────────
import Image from 'next/image';
import { CreatorProfile } from '@/types/store';

interface StoreHeaderProps {
  profile: CreatorProfile;
  productCount: number;
}

const VerifiedBadge = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Verified">
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      stroke="#FB5C06"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function StoreHeader({ profile, productCount }: StoreHeaderProps) {
  // social_links is a JSON column: { twitter, instagram, website, ... }
  const socials = profile.social_links ?? {};
  const hasSocials = socials.twitter || socials.instagram || socials.website;
  const isVerified = profile.verified_at !== null;

  return (
    <header className="w-full">
      {/* ── Banner image / gradient fallback ─────── */}
      <div className="relative h-44 w-full overflow-hidden md:h-60">
        {profile.banner_image ? (
          <Image
            src={profile.banner_image}
            alt={`${profile.display_name} store banner`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: 'linear-gradient(135deg, #0C0C0C 0%, #1c0900 60%, #2d1200 100%)',
            }}
          >
            <div
              className="absolute bottom-0 left-1/2 h-28 w-56 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: 'rgba(251,92,6,0.12)' }}
            />
          </div>
        )}
        {/* Fade into page bg */}
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: 'linear-gradient(to top, #0C0C0C, transparent)' }}
        />
      </div>

      {/* ── Profile content ──────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Avatar + product count row */}
        <div className="relative -mt-12 mb-4 flex items-end justify-between">
          <div className="relative shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-[3px] border-[#0C0C0C] shadow-lg md:h-24 md:w-24">
              {profile.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt={profile.display_name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface)]">
                  <span className="font-syne text-2xl font-extrabold text-[color:var(--color-brand)]">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {isVerified && (
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0C0C0C]"
                title="Verified creator"
              >
                <VerifiedBadge />
              </span>
            )}
          </div>

          {/* Product count pill */}
          <div
            className="mb-1 rounded-xl border px-3 py-1.5"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
          >
            <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>

        {/* display_name + store_slug */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="font-syne text-xl font-extrabold text-white md:text-2xl">
            {profile.display_name}
          </h1>
          <span className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            @{profile.store_slug}
          </span>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p
            className="mb-4 max-w-lg font-inter text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            {profile.bio}
          </p>
        )}

        {/* Social links — from social_links JSON column */}
        {hasSocials && (
          <div className="mb-2 flex flex-wrap gap-2">
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-inter text-xs transition-colors hover:text-white"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                <TwitterIcon /> Twitter / X
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-inter text-xs transition-colors hover:text-white"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                <InstagramIcon /> Instagram
              </a>
            )}
            {socials.website && (
              <a
                href={socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-inter text-xs transition-colors hover:text-white"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                <GlobeIcon /> Website
              </a>
            )}
          </div>
        )}

        <div className="mt-6 h-px w-full" style={{ background: 'var(--border)' }} />
      </div>
    </header>
  );
}