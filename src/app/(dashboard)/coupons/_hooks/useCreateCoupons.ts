import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { COUPONS_KEY } from './useCoupons';
import type { CreateCouponPayload } from '../_lib/type';

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