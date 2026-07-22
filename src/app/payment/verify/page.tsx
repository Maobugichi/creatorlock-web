import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PaymentVerify from './PaymentVerify';

interface Props {
  searchParams: Promise<{ reference?: string }>;
}

export default async function PaymentVerifyPage({ searchParams }: Props) {
  const { reference } = await searchParams
  if (!reference) redirect('/');  

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-brand rounded-full animate-spin" />
      </div>
    }>
      <PaymentVerify reference={reference} />
    </Suspense>
  );
}