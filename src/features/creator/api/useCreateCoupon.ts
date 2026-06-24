import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { COUPONS_KEY } from './useCoupon';
import type { CreateCouponPayload } from '../types/coupon.types';

export function useCreateCoupon(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCouponPayload) =>
      api.post('/coupons', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
      onSuccess?.();
    },
  });
}