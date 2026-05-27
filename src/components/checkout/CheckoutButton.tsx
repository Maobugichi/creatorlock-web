'use client';

import { ProductWithFiles } from '@/types/store';
import { formatNGN } from '@/lib/utils';
import CheckoutModal from './CheckoutModal';
import { useState } from 'react';

interface CheckoutButtonProps {
  product: ProductWithFiles;
}

export default function CheckoutButton({ product }: CheckoutButtonProps) {
  const [open, setOpen] = useState(false);
  const isFree = product.price_cents === 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="w-full rounded-xl px-4 py-3.5 font-syne text-sm font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
        style={{ background: 'var(--color-brand)' }}
      >
        {isFree ? 'Get for Free' : `Buy · ${formatNGN(product.price_cents)}`}
      </button>

      {open && (
        <CheckoutModal
          product={product}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}