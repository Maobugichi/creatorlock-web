// app/payment/verify/page.tsx
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PaymentVerify from './PaymentVerify';

interface Props {
  searchParams: { reference?: string };
}

export default function PaymentVerifyPage({ searchParams }: Props) {
  if (!searchParams.reference) redirect('/');  // server-side, no anti-pattern

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-brand rounded-full animate-spin" />
      </div>
    }>
      <PaymentVerify reference={searchParams.reference} />
    </Suspense>
  );
}