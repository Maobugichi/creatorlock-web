import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { BalanceResponse } from '../types/payout.types';

export const BALANCE_KEY = ['payouts', 'balance'] as const;

export function useBalance() {
  return useQuery<BalanceResponse>({
    queryKey: BALANCE_KEY,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BalanceResponse }>('/payouts/balance');
      return res.data.data;
    },
  });
}