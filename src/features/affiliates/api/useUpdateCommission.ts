import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/features/creator/hooks/useToast';
import type { ApiError } from '../types/affiliate.types';

interface UpdateCommissionPayload {
  affiliateId: string;
  commissionPercent: number;
}

export function useUpdateCommission() {
  const queryClient = useQueryClient();
  const { show } = useToast();

  const { mutate: updateCommission, isPending: isUpdating } = useMutation({
    mutationFn: ({ affiliateId, commissionPercent }: UpdateCommissionPayload) =>
      api
        .patch(`/affiliates/${affiliateId}/commission`, { commission_percent: commissionPercent })
        .then((res) => res.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      show(
        `Commission updated to ${variables.commissionPercent}%`,
        'success',
        'Applies to future conversions only — existing earnings are unaffected'
      );
    },
    onError: (err: ApiError) => {
      show(err?.response?.data?.message ?? 'Failed to update commission', 'error');
    },
  });

  return { updateCommission, isUpdating };
}