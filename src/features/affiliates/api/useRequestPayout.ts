import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiError, AffiliatePayout } from '../types/affiliate.types';

interface RequestPayoutPayload {
  bank_code: string;
  account_number: string;
}

interface UseRequestPayoutOptions {
  onSuccess?: () => void;
}

export function useRequestPayout({ onSuccess }: UseRequestPayoutOptions = {}) {
  const queryClient = useQueryClient();
  const [payoutError, setPayoutError] = useState<string | null>(null);

  const { mutate: requestPayout, isPending } = useMutation({
    mutationFn: (payload: RequestPayoutPayload) =>
      api.post('/affiliate-payouts/me/request', payload).then((res) => res.data as { data: AffiliatePayout }),
    onSuccess: () => {
      setPayoutError(null);
      queryClient.invalidateQueries({ queryKey: ['affiliate-payout-balance'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-payouts'] });
      onSuccess?.();
    },
    onError: (err: ApiError) => {
      setPayoutError(err?.response?.data?.message ?? 'Something went wrong. Try again.');
    },
  });

  return { requestPayout, isPending, payoutError };
}