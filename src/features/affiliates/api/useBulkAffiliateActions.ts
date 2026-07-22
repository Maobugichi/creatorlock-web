import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/features/creator/hooks/useToast';
import type { Affiliate } from '../types/affiliate.types';

export function useBulkAffiliateActions() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  async function bulkDeactivate(affiliates: Affiliate[]) {
    const targets = affiliates.filter((a) => a.active);
    const alreadyInactive = affiliates.length - targets.length;

    if (targets.length === 0) {
      show('Nothing to deactivate', 'info', 'Selected affiliates are already inactive');
      return;
    }

    setIsProcessing(true);
    const results = await Promise.allSettled(
      targets.map((a) => api.patch(`/affiliates/${a.id}/toggle`))
    );
    setIsProcessing(false);
    queryClient.invalidateQueries({ queryKey: ['affiliates'] });

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - succeeded;

    show(
      `Deactivated ${succeeded}`,
      failed > 0 ? 'error' : 'success',
      [
        alreadyInactive > 0 ? `${alreadyInactive} already inactive` : null,
        failed > 0 ? `${failed} failed` : null,
      ].filter(Boolean).join(' · ') || undefined
    );
  }

  // Blocks the entire batch if any selected affiliate has conversion
  // history, rather than silently skipping some — a partial delete where
  // the user can't see which ones succeeded is worse than making them
  // deselect and retry with a clear reason.
  async function bulkDelete(affiliates: Affiliate[]) {
    const blocked = affiliates.filter((a) => a.total_conversions > 0);
    if (blocked.length > 0) {
      show(
        'Cannot delete selection',
        'error',
        `${blocked.length} affiliate${blocked.length !== 1 ? 's have' : ' has'} conversion history — deselect and try again`
      );
      return;
    }

    setIsProcessing(true);
    const results = await Promise.allSettled(
      affiliates.map((a) => api.delete(`/affiliates/${a.id}`))
    );
    setIsProcessing(false);
    queryClient.invalidateQueries({ queryKey: ['affiliates'] });

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - succeeded;

    show(
      `Deleted ${succeeded}`,
      failed > 0 ? 'error' : 'success',
      failed > 0 ? `${failed} failed` : undefined
    );
  }

  return { bulkDeactivate, bulkDelete, isProcessing };
}