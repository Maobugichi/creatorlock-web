// ─────────────────────────────────────────────
//  CreatorLock — Store & Buyer Type Definitions
//  src/types/store.ts
//  NOTE: Dashboard types live in their own file — do not merge.
//  All field names mirror the exact backend DB columns.
// ─────────────────────────────────────────────

// Mirrors creator_profiles table row
export interface CreatorProfile {
  id: string;
  user_id: string;
  display_name: string;
  store_slug: string;
  bio: string | null;
  profile_image: string | null;
  banner_image: string | null;
  social_links: Record<string, string> | null;
  store_customization: Record<string, unknown> | null;
  payout_enabled: boolean;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  verified_at: string | null;   // serialised Date from JSON
  suspended_at: string | null;
  suspended_reason: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Mirrors products table row

export type ProductStatus =  'draft' | 'published' | 'unpublished' | 'deleted';

export interface Product {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;          // integer cents — use formatNGN(price_cents)
  thumbnail: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}


// Mirrors ProductWithFiles from backend
export interface ProductFile {
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

export interface ProductWithFiles extends Product {
  files: ProductFile[];
}

// GET /store/:slug → data envelope
export interface StoreData {
  profile: CreatorProfile;
  products: ProductWithFiles[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


// ── Buyer / download types (used in library + download pages) ─

export interface BuyerProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface LibraryItem {
  order_id: string;
  product_id: string;
  product_title: string;
  product_thumbnail: string | null;
  creator_name: string;
  price_cents: number;
  purchased_at: string;
  download_token: string;
  downloads_used: number;
  download_limit: number;
  expires_at: string | null;
}

export interface DownloadFile {
  id: string;
  name: string;
  size_bytes: number;
  download_url: string;
}

export interface DownloadTokenData {
  valid: boolean;
  expired: boolean;
  exhausted: boolean;
  product_title: string;
  file_count: number;
  downloads_used: number;
  download_limit: number;
  expires_at: string | null;
  files: DownloadFile[];
  single_file_url: string | null;
}

export interface CouponResult {
  coupon_id: string;
  original_price_cents: number;
  discount_cents: number;
  final_price_cents: number;
}

export interface InitiatePaymentResult {
  paymentUrl: string | null;
  ref: string;
  free: boolean;
  originalPriceCents?: number;
  discountCents?: number;
  finalPriceCents?: number;
}