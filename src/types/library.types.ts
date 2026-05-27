// src/types/library.ts
// Buyer Library — shared type contracts
// Dates arrive as ISO strings over JSON wire (node-postgres Date → JSON.stringify)

export interface LibraryItem {
  order_id: string;
  product_id: string;
  product_title: string;
  product_thumbnail: string | null;
  creator_name: string;
  store_slug: string;
  amount_cents: number;
  purchased_at: string;       // ISO 8601 — use new Date(purchased_at) to parse
  downloads_used: number;
  max_downloads: number;      // COALESCE default: 3
  token_revoked: boolean;
  token_expires_at: string;   // ISO 8601 — use new Date(token_expires_at) to parse
}

export interface GetBuyerLibraryResponse {
  success: boolean;
  count: number;
  data: LibraryItem[];
}

export interface ResendDownloadResponse {
  success: boolean;
  message: string; // "Download link resent - check your email"
}