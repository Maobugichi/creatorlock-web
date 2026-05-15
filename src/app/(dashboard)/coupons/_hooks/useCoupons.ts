import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { CouponsResponse } from '../_lib/type';

export const COUPONS_KEY = ['coupons'] as const;

export function useCoupons() {
  const query = useQuery<CouponsResponse>({
    queryKey: COUPONS_KEY,
    queryFn: () =>
      api.get<CouponsResponse>('/coupons').then((r) => r.data),
  });

  return {
    ...query,
    coupons: query.data?.data ?? [],
  };
}