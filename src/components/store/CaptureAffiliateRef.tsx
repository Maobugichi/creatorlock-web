// src/components/store/CaptureAffiliateRef.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveAffiliateRef } from '@/lib/affiliateRef';

export default function CaptureAffiliateRef() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) saveAffiliateRef(ref);
  }, []);

  return null; 
}