import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import type { AffiliateStats } from '../types/affiliate.types';

export function useAffiliateStats(enabled: boolean = true) {
  return useQuery<AffiliateStats>({
    queryKey: ['affiliate-stats'],
    enabled,
    queryFn: async () => {
      try {
        const res = await api.get('/affiliates/me');
        return res.data?.data ?? { affiliates: [], total_earned_cents: 0, pending_payout_cents: 0 };
      } catch (err) {
        if (isAxiosError(err)) {
          console.error('[useAffiliateStats] status :', err.response?.status);
          console.error('[useAffiliateStats] message:', err.response?.data?.message ?? err.response?.data ?? err.message);
          console.error('[useAffiliateStats] full response data:', err.response?.data);
        } else {
          console.error('[useAffiliateStats] unexpected error:', err);
        }
        throw err;
      }
    },
  });
}