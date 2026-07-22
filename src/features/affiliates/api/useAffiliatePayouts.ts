import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import type { AffiliatePayout } from '../types/affiliate.types';

export function useAffiliatePayouts() {
  return useQuery<AffiliatePayout[]>({
    queryKey: ['affiliate-payouts'],
    queryFn: async () => {
      try {
        const res = await api.get('/affiliate-payouts/me');
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        return [];
      } catch (err) {
        if (isAxiosError(err)) {
          console.error('[useAffiliatePayouts] status :', err.response?.status);
          console.error('[useAffiliatePayouts] message:', err.response?.data?.message ?? err.response?.data ?? err.message);
          console.error('[useAffiliatePayouts] full response data:', err.response?.data);
        } else {
          console.error('[useAffiliatePayouts] unexpected error:', err);
        }
        throw err;
      }
    },
  });
}