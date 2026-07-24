import type { PayoutStatus } from '@/features/shared/types/payout-status.types';

export interface AdminCreatorPayout {
  id: string;
  creator_id: string;
  amount_cents: number;
  currency: string;
  status: PayoutStatus;
  bank_code: string | null;
  account_number: string | null;
  account_name: string | null;
  paystack_transfer_code: string | null;
  failure_reason: string | null;
  requested_at: string;
  processed_at: string | null;
  creator_name: string;
  creator_email: string;
  store_slug: string;
}

export interface AdminAffiliatePayout {
  id: string;
  affiliate_user_id: string;
  amount_cents: number;
  currency: string;
  status: PayoutStatus;
  bank_code: string | null;
  account_number: string | null;
  account_name: string | null;
  paystack_transfer_code: string | null;
  failure_reason: string | null;
  requested_at: string;
  processed_at: string | null;
  affiliate_name: string;
  affiliate_email: string;
}