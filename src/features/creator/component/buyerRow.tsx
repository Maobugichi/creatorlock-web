import { formatNGN, formatDate } from '@/lib/utils';
import type { BuyerRow } from '../types/buyer.types';

const getInitials = (name: string) =>
  (name ?? '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

interface Props {
  buyer: BuyerRow;
  selected: boolean;
  onSelect: () => void;
}

export function BuyerRowItem({ buyer, selected, onSelect }: Props) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 border-b border-border last:border-0 transition-colors ${
        selected ? 'bg-primary/[0.04]' : 'hover:bg-elevated/50'
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer shrink-0 mr-4"
        aria-label={`Select ${buyer.name}`}
      />

      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="text-primary text-xs font-syne font-bold">{getInitials(buyer.name)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-surface-foreground text-sm font-medium truncate">{buyer.name}</p>
          <p className="text-muted-foreground text-xs truncate">{buyer.email}</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="text-right w-20">
          <p className="text-surface-foreground text-sm font-mono">{buyer.total_purchases}</p>
          <p className="text-muted-foreground text-xs">orders</p>
        </div>
        <div className="text-right w-20">
          <p className="text-surface-foreground text-sm font-mono">{formatNGN(parseInt(buyer.total_spent_cents))}</p>
          <p className="text-muted-foreground text-xs">spent</p>
        </div>
        <div className="text-right w-20">
          <p className="text-muted-foreground text-xs font-mono">{formatDate(buyer.last_purchase_at)}</p>
          <p className="text-muted-foreground text-xs">last order</p>
        </div>
      </div>
    </div>
  );
}