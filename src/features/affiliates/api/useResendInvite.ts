import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiError } from '../types/affiliate.types';

export function useResendInvite(affiliateId: string) {
  const queryClient = useQueryClient();
  const [resendError, setResendError] = useState<string | null>(null);

  const { mutate: resendInvite, isPending: isResending } = useMutation({
    mutationFn: () =>
      api.post(`/affiliates/${affiliateId}/resend-invite`).then((res) => res.data),
    onSuccess: () => {
      setResendError(null);
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
    onError: (err: ApiError) => {
      setResendError(err?.response?.data?.message ?? 'Failed to resend invite');
    },
  });

  return { resendInvite, isResending, resendError };
}