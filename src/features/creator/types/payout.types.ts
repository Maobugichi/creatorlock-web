import type { ApiError } from '@/features/auth/types/auth.types';
import type { Bank, ResolveResponse } from '@/features/shared/types/bank-account.types';
import type { PayoutStatus } from '@/features/shared/types/payout-status.types';

export type { ApiError, Bank, ResolveResponse, PayoutStatus };

export interface BalanceResponse {
  total_earned: number;
  total_paid_out: number;
  available: number;
}

export interface Payout {
  id: string;
  amount_cents: number;
  status: PayoutStatus;
  bank_code: string;
  account_number: string;
  account_name: string;
  requested_at: string;
  failure_reason: string | null;
}