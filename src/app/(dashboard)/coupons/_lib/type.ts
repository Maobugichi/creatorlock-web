export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  used_count: number;
  max_uses: number | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

export interface CouponsResponse {
  success: boolean;
  count: number;
  data: Coupon[];
}

export interface ApiError {
  response?: { data?: { message?: string } };
}

export interface CreateCouponPayload {
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  max_uses?: number;
  expires_at?: string;
}