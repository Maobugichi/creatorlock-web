import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { COUPONS_KEY } from './useCoupons';

export function useToggleCoupon(couponId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.patch(`/coupons/${couponId}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }),
  });
}