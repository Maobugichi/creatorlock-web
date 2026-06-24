import type { Coupon, ApiError } from '../types/coupon.types';

export const formatDiscountLabel = (coupon: Coupon): string =>
  coupon.discount_type === 'percent'
    ? `${coupon.discount_value}% off`
    : `₦${coupon.discount_value.toLocaleString('en-NG')} off`;

export const formatExpiryLabel = (expires_at: string | null): string | null =>
  expires_at
    ? new Date(expires_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

export const extractApiError = (error: unknown): string =>
  (error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.';