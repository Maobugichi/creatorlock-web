import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import type { AffiliateBalance } from '../types/affiliate.types';

export function useAffiliateBalance() {
  return useQuery<AffiliateBalance>({
    queryKey: ['affiliate-payout-balance'],
    queryFn: async () => {
      try {
        const res = await api.get('/affiliate-payouts/me/balance');
        return res.data?.data ?? { total_earned: 0, total_paid_out: 0, available: 0 };
      } catch (err) {
        if (isAxiosError(err)) {
          console.error('[useAffiliateBalance] status :', err.response?.status);
          console.error('[useAffiliateBalance] message:', err.response?.data?.message ?? err.response?.data ?? err.message);
          console.error('[useAffiliateBalance] full response data:', err.response?.data);
        } else {
          console.error('[useAffiliateBalance] unexpected error:', err);
        }
        throw err;
      }
    },
  });
}