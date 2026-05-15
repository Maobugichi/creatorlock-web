export interface ApiError {
  response?: { data?: { message?: string } };
}

export interface Purchase {
  id: string;
  product_id: string;
  product_title: string;
  price_cents: number;
  purchased_at: string;
  status: 'active' | 'expired' | 'refunded';
}

export interface LibraryResponse {
  purchases: Purchase[];
}

export const STATUS_STYLES: Record<Purchase['status'], { label: string; classes: string }> = {
  active:   { label: 'Active',   classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  expired:  { label: 'Expired',  classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  refunded: { label: 'Refunded', classes: 'bg-white/5 text-[var(--muted)] border-white/10' },
};