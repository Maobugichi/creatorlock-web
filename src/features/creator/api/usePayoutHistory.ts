import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Payout } from '../types/payout.types';

export const PAYOUT_HISTORY_KEY = ['payouts', 'me'] as const;

export function usePayoutHistory() {
  const query = useQuery<{ payouts: Payout[] }>({
    queryKey: PAYOUT_HISTORY_KEY,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Payout[] }>('/payouts/me');
      return { payouts: res.data.data };
    },
  });

  return {
    ...query,
    payouts: query.data?.payouts ?? [],
  };
}