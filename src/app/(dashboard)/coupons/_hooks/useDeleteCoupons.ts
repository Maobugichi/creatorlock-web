import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { COUPONS_KEY } from './useCoupons';

export function useDeleteCoupon(couponId: string) {
  const queryClient = useQueryClient();

 return useMutation<void, Error, boolean>({
  mutationFn: async (confirmed) => {
    if (confirmed) await api.delete(`/coupons/${couponId}`);
  },
  onSuccess: (_, confirmed) => {
    if (confirmed) queryClient.invalidateQueries({ queryKey: COUPONS_KEY });
  },
});
}