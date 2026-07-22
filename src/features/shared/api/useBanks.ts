import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Bank } from '../types/bank-account.types';

export const BANKS_KEY = ['shared', 'banks'] as const;

export function useBanks() {
  const query = useQuery<{ banks: Bank[] }>({
    queryKey: BANKS_KEY,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Bank[] }>('/payouts/banks');
      return { banks: res.data.data };
    },
    staleTime: Infinity, // bank list doesn't change — no need to refetch
  });

  return {
    ...query,
    banks: query.data?.banks ?? [],
  };
}