import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiError } from '../../affiliates/types/affiliate.types';

interface InvitePayload {
  affiliate_email: string;
  commission_percent: number;
}

interface UseInviteAffiliateOptions {
  onSuccess?: () => void;
}

export function useInviteAffiliate({ onSuccess }: UseInviteAffiliateOptions = {}) {
  const queryClient = useQueryClient();
  const [inviteError, setInviteError] = useState<string | null>(null);

  const { mutate: inviteAffiliate, isPending } = useMutation({
    mutationFn: (payload: InvitePayload) =>
      api.post('/affiliates', payload).then((res) => res.data),
    onSuccess: () => {
      setInviteError(null);
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      onSuccess?.();
    },
    onError: (err: ApiError) => {
      setInviteError(err?.response?.data?.message ?? 'Something went wrong. Try again.');
    },
  });

  return { inviteAffiliate, isPending, inviteError };
}