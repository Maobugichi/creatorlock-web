'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Affiliate } from '../_types';
import { StatusBadge } from './status-badge';

export function AffiliateRow({ affiliate }: { affiliate: Affiliate }) {
  const queryClient = useQueryClient();

  const { mutate: toggle, isPending: isToggling } = useMutation({
    mutationFn: () =>
      api.patch(`/affiliates/${affiliate.id}/toggle`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
  });

  const initials = affiliate.affiliate_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-white/[0.015] transition-colors">
    
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
          <span className="text-brand text-xs font-syne font-bold">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{affiliate.affiliate_name}</p>
          <p className="text-[var(--muted)] text-xs truncate">{affiliate.affiliate_email}</p>
        </div>
      </div>

      
      <div className="flex items-center gap-6 shrink-0 ml-4">
        <div className="hidden sm:block text-right">
          <p className="text-white text-sm font-mono">{affiliate.total_conversions}</p>
          <p className="text-[var(--muted)] text-xs">conversions</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-white text-sm font-mono">{affiliate.commission_percent}%</p>
          <p className="text-[var(--muted)] text-xs">commission</p>
        </div>
        <div className="hidden sm:block">
          <StatusBadge active={affiliate.active} />
        </div>
        <button
          onClick={() => toggle()}
          disabled={isToggling}
          className={`text-xs font-syne font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            affiliate.active
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
              : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
          }`}
        >
          {isToggling ? '…' : affiliate.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}