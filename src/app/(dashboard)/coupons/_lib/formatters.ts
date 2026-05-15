import type { Coupon } from './type';

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

// Keep local import tidy — re-export the type it uses
import type { ApiError } from './type';