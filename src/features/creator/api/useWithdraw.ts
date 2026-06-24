import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PAYOUT_HISTORY_KEY } from './usePayoutHistory';

interface WithdrawPayload {
  bankCode: string;
  accountNumber: string;
}

interface UseWithdrawOptions {
  onSuccess?: () => void;
}

export function useWithdraw({ onSuccess }: UseWithdrawOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bankCode, accountNumber }: WithdrawPayload) => {
      await api.post('/payouts/request', {
        bank_code: bankCode,
        account_number: accountNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYOUT_HISTORY_KEY });
      onSuccess?.();
    },
  });
}