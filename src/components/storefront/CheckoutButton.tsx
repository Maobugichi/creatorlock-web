// src/components/storefront/CheckoutButton.tsx
'use client';

import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

interface CheckoutButtonProps {
  productId: string;
  productTitle: string;
  priceCents: number;
  isFree: boolean;
  affiliateCode?: string;
}

export default function CheckoutButton({
  productId,
  productTitle,
  priceCents,
  isFree,
  affiliateCode,
}: CheckoutButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 px-6 transition-all duration-150"
      >
        {isFree ? 'Get for free' : 'Buy now'}
      </button>

      {open && (
        <CheckoutModal
          productId={productId}
          productTitle={productTitle}
          priceCents={priceCents}
          isFree={isFree}
          affiliateCode={affiliateCode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}