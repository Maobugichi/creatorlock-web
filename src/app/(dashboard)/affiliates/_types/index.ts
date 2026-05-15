export interface Affiliate {
  id: string;
  creator_id: string;
  affiliate_user_id: string;
  commission_percent: number;
  code: string;
  total_earned: number;
  active: boolean;
  created_at: string;
  affiliate_name: string;
  affiliate_email: string;
  total_conversions: number;
}

export interface ApiError {
  response?: { data?: { message?: string } };
}