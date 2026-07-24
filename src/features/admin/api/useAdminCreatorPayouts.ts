import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import api from '@/lib/api';
import type { AdminCreatorPayout } from '../types/admin-payout.types';
import type { ApiError } from '@/features/auth/types/auth.types';

export function useAdminCreatorPayouts(status?: string) {
  return useQuery<AdminCreatorPayout[]>({
    queryKey: ['admin-creator-payouts', status ?? 'all'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/payouts', { params: status ? { status } : {} });
        return res.data?.data ?? [];
      } catch (err) {
        if (isAxiosError(err)) {
          console.error('[useAdminCreatorPayouts] status :', err.response?.status);
          console.error('[useAdminCreatorPayouts] message:', err.response?.data?.message ?? err.message);
        }
        throw err;
      }
    },
  });
}

export function useApproveCreatorPayout() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: approve, isPending } = useMutation({
    mutationFn: (payoutId: string) =>
      api.post(`/admin/payouts/${payoutId}/approve`).then((res) => res.data),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-creator-payouts'] });
    },
    onError: (err: ApiError) => {
      setError(err?.response?.data?.message ?? 'Failed to approve payout');
    },
  });

  return { approve, isPending, error };
}

export function useProcessCreatorPayout() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: process, isPending } = useMutation({
    mutationFn: (payoutId: string) =>
      api.post(`/admin/payouts/${payoutId}/process`).then((res) => res.data),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-creator-payouts'] });
    },
    onError: (err: ApiError) => {
      setError(err?.response?.data?.message ?? 'Failed to process payout');
    },
  });

  return { process, isPending, error };
}