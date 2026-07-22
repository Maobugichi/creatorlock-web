import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiError } from '../types/affiliate.types';

interface UseDeleteAffiliateOptions {
  onSuccess?: () => void;
}

export function useDeleteAffiliate(affiliateId: string, { onSuccess }: UseDeleteAffiliateOptions = {}) {
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutate: deleteAffiliate, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete(`/affiliates/${affiliateId}`).then((res) => res.data),
    onSuccess: () => {
      setDeleteError(null);
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      onSuccess?.();
    },
    onError: (err: ApiError) => {
      setDeleteError(err?.response?.data?.message ?? 'Failed to delete affiliate');
    },
  });

  return { deleteAffiliate, isDeleting, deleteError };
}