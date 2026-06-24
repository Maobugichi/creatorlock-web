// ─── Product ──────────────────────────────────────────────────────────────────

export type ProductStatus = "draft" | "published" | "unpublished" | "flagged";
export type FilterStatus = "all" | ProductStatus;
export type SortOption = "newest" | "oldest" | "price_high" | "price_low";

export interface Product {
  id: string;
  title: string;
  price_cents: number;
  status: ProductStatus;
  thumbnail?: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
}

// ─── Edit Product ────────────────────────────────────────────────────────────

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

export interface EditProduct {
  id: string;
  title: string;
  price_cents: number;
  description?: string;
  thumbnail?: string;
  status: "draft" | "published" | "unpublished" | "flagged";
  files: ProductFile[];
}

export type SaveStage = "idle" | "saving" | "uploading";



// ─── New Product ─────────────────────────────────────────────────────────────

export interface ProductDraft {
  id: string;
}



export interface SelectedFile {
  id: string;
  file: File;
}

export type SubmitStage = "idle" | "creating" | "uploading" | "publishing";

// ─── Error ────────────────────────────────────────────────────────────────────
// ApiError is app-wide — import from the single source of truth
export type { ApiError } from "@/features/auth/types/auth.types";