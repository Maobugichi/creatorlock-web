import type { ApiError } from '@/features/auth/types/auth.types';

export type { ApiError };

export interface BalanceResponse {
  total_earned: number;
  total_paid_out: number;
  available: number;
}

export interface Bank {
  code: string;
  name: string;
}

export interface ResolveResponse {
  account_name: string;
  account_number: string;
}

export interface Payout {
  id: string;
  amount_cents: number;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'failed' | 'reversed';
  bank_code: string;
  account_number: string;
  account_name: string;
  requested_at: string;
  failure_reason: string | null;
}