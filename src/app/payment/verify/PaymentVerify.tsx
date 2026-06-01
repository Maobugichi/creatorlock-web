
// app/payment/verify/PaymentVerify.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface VerifyResult {
  status: 'success' | 'failed' | 'abandoned' | 'pending';
  order: {
    product_title: string;
    status: string;
  } | null;
}

const WEBHOOK_WAIT_TIMEOUT = 30 * 1000; 

const verifyPayment = async (
  reference: string
): Promise<VerifyResult> => {
  const { data } = await api.get(
    `/payments/verify/${reference}`
  );

  return data.data;
};

export default function PaymentVerify({
  reference,
}: {
  reference: string;
}) {
  const router = useRouter();

  const [webhookTimedOut, setWebhookTimedOut] = useState(false);
   
  const { data, isPending, isError } = useQuery({
    queryKey: ['payment-verify', reference],

    queryFn: () => verifyPayment(reference),

    enabled: Boolean(reference),

    retry: 2,

    staleTime: Infinity,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    //refetchOnMount: false,
    refetchIntervalInBackground: false,

    refetchInterval: (query) => {
      const result = query.state.data;

      if (!result) return false;

      if (webhookTimedOut) return false;

      const paystackSucceeded =
        result.status === 'success';

      const orderPending =
        !result.order ||
        result.order.status === 'pending';

      return paystackSucceeded && orderPending
        ? 3000
        : false;
    },
  });

  const waitingForWebhook = useMemo(() => 
    data?.status === 'success' && (!data.order || data.order.status === 'pending'),
    [data]
    );


    useEffect(() => {
    if (!waitingForWebhook) return;

    const timer = setTimeout(() => {
        setWebhookTimedOut(true);
    }, WEBHOOK_WAIT_TIMEOUT);

    return () => clearTimeout(timer);
    }, [waitingForWebhook]);
 

  if (isPending) {
    return (
      <LoadingScreen label="Confirming your payment…" />
    );
  }

  if (data?.status === 'pending') {
    return (
      <LoadingScreen label="Your payment is still being confirmed…" />
    );
  }

  const webhookPending =
    data?.status === 'success' &&
    (!data.order ||
      data.order.status === 'pending');

  if (webhookPending && !webhookTimedOut) {
    return (
      <LoadingScreen label="Finalising your order…" />
    );
  }

  if (webhookPending && webhookTimedOut) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              'rgba(245,158,11,0.12)',
            border:
              '1px solid rgba(245,158,11,0.3)',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
            />
            <line
              x1="12"
              y1="16"
              x2="12.01"
              y2="16"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-syne text-2xl font-extrabold text-white">
            Payment received
          </h1>

          <p className="mt-3 font-inter text-sm text-white/50">
            Your payment was successful,
            but your order is still being
            processed. Your download link
            will be sent by email shortly.
          </p>

          <p className="mt-4 font-mono text-xs text-white/40">
            Ref: {reference}
          </p>
        </div>

        <button
          onClick={() => router.replace('/')}
          className="rounded-xl px-8 py-3 font-syne text-sm font-bold text-white"
          style={{
            background:
              'var(--color-brand)',
          }}
        >
          Back to home
        </button>
      </div>
    );
  }

  if (
    isError ||
    !data ||
    data.status === 'failed' ||
    data.status === 'abandoned'
  ) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              'rgba(239,68,68,0.1)',
            border:
              '1px solid rgba(239,68,68,0.25)',
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <line
              x1="12"
              y1="8"
              x2="12"
              y2="12"
            />
            <line
              x1="12"
              y1="16"
              x2="12.01"
              y2="16"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-syne text-2xl font-extrabold text-white">
            Payment could not be confirmed
          </h1>

          <p className="mt-3 font-inter text-sm text-white/50">
            We couldn`&apos;`t verify your payment
            status. If funds were deducted,
            please contact support and
            provide your payment reference.
          </p>

          <p className="mt-4 font-mono text-xs text-white/40">
            Ref: {reference}
          </p>
          <p className="mt-3 font-inter text-sm text-white/50">
            If funds were deducted, please{' '}
            <a href="mailto:support@creatorlock.co"
                className="underline text-white/70 hover:text-white">
                contact support
            </a>{' '}
            with your reference below.
            </p>
        </div>

        <button
          onClick={() => router.back()}
          className="rounded-xl px-8 py-3 font-syne text-sm font-bold text-white"
          style={{
            background:
              'var(--color-brand)',
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background:
            'rgba(16,185,129,0.12)',
          border:
            '1px solid rgba(16,185,129,0.3)',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div>
        <h1 className="font-syne text-2xl font-extrabold text-white">
          Payment successful!
        </h1>

        {data.order?.product_title && (
          <p className="mt-2 font-inter text-sm text-white/50">
            {data.order.product_title}
          </p>
        )}

        <p className="mt-3 font-inter text-sm text-white/50">
          Check your email for the download
          link.
        </p>

        <p className="mt-4 font-mono text-xs text-white/40">
          Ref: {reference}
        </p>
      </div>

      <button
        onClick={() => router.replace('/')}
        className="rounded-xl px-8 py-3 font-syne text-sm font-bold text-white"
        style={{
          background:
            'var(--color-brand)',
        }}
      >
        Back to home
      </button>
    </div>
  );
}

function LoadingScreen({
  label,
}: {
  label: string;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
      <svg
        className="animate-spin"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="2"
        role="status"
        aria-label="Loading"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>

      <p
        className="font-inter text-sm text-white/50"
        aria-live="polite"
      >
        {label}
      </p>
    </div>
  );
}

