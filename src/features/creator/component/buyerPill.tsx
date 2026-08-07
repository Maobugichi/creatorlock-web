'use client';

import type { BuyerRow } from '../types/buyer.types';

interface BuyerPillProps {
  buyer: BuyerRow;
  onRemove: (id: string) => void;
}

export function BuyerPill({ buyer, onRemove }: BuyerPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/25 text-primary text-xs rounded-full px-2.5 py-1">
      {buyer.name}
      <button
        type="button"
        onClick={() => onRemove(buyer.buyer_id)}
        className="opacity-50 hover:opacity-100 transition-opacity leading-none"
        aria-label={`Remove ${buyer.name}`}
      >
        ✕
      </button>
    </span>
  );
}