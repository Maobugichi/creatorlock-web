export interface ProductFile {
  id: string;
  product_id: string;
  url: string;
  public_id: string;
  original_name: string | null;
  format: string | null;
  size: number | null;
  created_at: string;
}

export type ProductCategory =
  | "ebook"
  | "course"
  | "template"
  | "design"
  | "music"
  | "video"
  | "other";

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "ebook", label: "eBooks" },
  { value: "course", label: "Courses" },
  { value: "template", label: "Templates" },
  { value: "design", label: "Design" },
  { value: "music", label: "Music" },
  { value: "video", label: "Video" },
  { value: "other", label: "Other" },
];

export interface DiscoverProduct {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  thumbnail: string | null;
  category: ProductCategory;
  status: 'draft' | 'published' | 'unpublished' | 'deleted';
  created_at: string;
  updated_at: string;
  files: ProductFile[];
  display_name: string;
  store_slug: string;
}

export interface PaginatedProducts {
  products: DiscoverProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductsResponse {
  success: true;
  data: PaginatedProducts;
}

export type SortOption = 'latest' | 'popular';


export interface BuyerProfile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

export interface UpdateBuyerProfileFields {
  name?: string;
  email?: string;
}

// ─── Download ─────────────────────────────────────────────────────────────────

export interface DownloadFile {
  filename: string | null;
  url: string;
}

export interface DownloadResponse {
  success: boolean;
  data: DownloadFile[];
}

export type DownloadResult =
  | { ok: true; downloads: DownloadFile[] }
  | { ok: false; expired: boolean };



export type { ApiError } from "@/features/auth/types/auth.types";
