import type { ApiError } from '@/features/auth/types/auth.types';

export type { ApiError };

export interface Affiliate {
  id: string;
  creator_id: string;
  affiliate_user_id: string;
  commission_percent: number;
  code: string;
  total_earned_cents: number;
  active: boolean;
  created_at: string;
  affiliate_name: string;
  affiliate_email: string;
  total_conversions: number;
  conversions_this_week: number;
  last_invite_sent_at: string | null; 
  store_slug: string; 
}

export interface AffiliateStatsRow {
  id: string;
  creator_id: string;
  affiliate_user_id: string;
  commission_percent: number;
  code: string;
  active: boolean;
  created_at: string;
  creator_name: string;
  total_conversions: number;
  total_earned_cents: number;
}

export interface AffiliateStats {
  affiliates: AffiliateStatsRow[];
  total_earned_cents: number;
  pending_payout_cents: number;
}

export interface AffiliateBalance {
  total_earned: number;
  total_paid_out: number;
  available: number;
}

export type AffiliatePayoutStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'reversed';

export interface AffiliatePayout {
  id: string;
  affiliate_user_id: string;
  amount_cents: number;
  currency: string;
  status: AffiliatePayoutStatus;
  bank_code: string | null;
  account_number: string | null;
  account_name: string | null;
  paystack_transfer_code: string | null;
  idempotency_key: string | null;
  approved_by: string | null;
  approved_at: string | null;
  failure_reason: string | null;
  requested_at: string | null;
  processed_at: string | null;
  notes: string | null;
}