import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ResolveResponse } from '../types/payout.types';

export function useResolveAccount(onResolved: (name: string) => void, onReset: () => void) {
  return useMutation({
    mutationFn: async ({ code, number }: { code: string; number: string }) => {
      const res = await api.get<{ success: boolean; data: ResolveResponse }>(
        '/payouts/resolve',
        { params: { bank_code: code, account_number: number } }
      );
      return res.data.data;
    },
    onSuccess: (data) => onResolved(data.account_name),
    onError: () => onReset(),
  });
}