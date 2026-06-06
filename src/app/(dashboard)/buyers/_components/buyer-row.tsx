import { formatNGN, formatDate } from '@/lib/utils';
import type { BuyerRow } from '../_lib/types';

const getInitials = (name: string) =>
  (name ?? '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

export function BuyerRowItem({ buyer }: { buyer: BuyerRow }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-white/[0.015] transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
          <span className="text-brand text-xs font-syne font-bold">{getInitials(buyer.name)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{buyer.name}</p>
          <p className="text-[var(--muted)] text-xs truncate">{buyer.email}</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="text-right">
          <p className="text-white text-sm font-mono">{buyer.total_purchases}</p>
          <p className="text-[var(--muted)] text-xs">orders</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-mono">{formatNGN(parseInt(buyer.total_spent_cents))}</p>
          <p className="text-[var(--muted)] text-xs">spent</p>
        </div>
        <div className="text-right">
          <p className="text-[var(--muted)] text-xs font-mono">{formatDate(buyer.last_purchase_at)}</p>
          <p className="text-[var(--muted)] text-xs">last order</p>
        </div>
      </div>
    </div>
  );
}