import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import api from '@/lib/api';
import type { AdminAffiliatePayout } from '../types/admin-payout.types';
import type { ApiError } from '@/features/auth/types/auth.types';

export function useAdminAffiliatePayouts(status?: string) {
  return useQuery<AdminAffiliatePayout[]>({
    queryKey: ['admin-affiliate-payouts', status ?? 'all'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/affiliate-payouts', { params: status ? { status } : {} });
        return res.data?.data ?? [];
      } catch (err) {
        if (isAxiosError(err)) {
          console.error('[useAdminAffiliatePayouts] status :', err.response?.status);
          console.error('[useAdminAffiliatePayouts] message:', err.response?.data?.message ?? err.message);
        }
        throw err;
      }
    },
  });
}

export function useApproveAffiliatePayout() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: approve, isPending } = useMutation({
    mutationFn: (payoutId: string) =>
      api.post(`/admin/affiliate-payouts/${payoutId}/approve`).then((res) => res.data),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-payouts'] });
    },
    onError: (err: ApiError) => {
      setError(err?.response?.data?.message ?? 'Failed to approve payout');
    },
  });

  return { approve, isPending, error };
}

export function useProcessAffiliatePayout() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { mutate: process, isPending } = useMutation({
    mutationFn: (payoutId: string) =>
      api.post(`/admin/affiliate-payouts/${payoutId}/process`).then((res) => res.data),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-payouts'] });
    },
    onError: (err: ApiError) => {
      setError(err?.response?.data?.message ?? 'Failed to process payout');
    },
  });

  return { process, isPending, error };
}