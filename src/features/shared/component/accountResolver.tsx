'use client';

import { useEffect, useRef, useState } from 'react';
import { useResolveAccount } from '../api/useResolveAccount';
import type { ApiError } from '@/features/auth/types/auth.types';

interface AccountResolverProps {
  bankCode: string;
  accountNumber: string;
  onResolved: (name: string) => void;
  onReset: () => void;
}

export function AccountResolver({ bankCode, accountNumber, onResolved, onReset }: AccountResolverProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate, isPending, isSuccess, isError, error, reset, data } = useResolveAccount(
    onResolved,
    onReset,
  );

  const key = `${bankCode}:${accountNumber}`;
  const [trackedKey, setTrackedKey] = useState(key);

  // Clear the stale result/error the moment the inputs change, computed during
  // render rather than in an effect — this is React's documented pattern for
  // "reset state when a prop changes" and avoids the extra render pass that
  // calling setState synchronously inside an effect body would trigger.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (key !== trackedKey) {
    setTrackedKey(key);
    onReset();
    reset();
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!bankCode || accountNumber.length !== 10) return;

    debounceRef.current = setTimeout(() => {
      mutate({ code: bankCode, number: accountNumber });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [bankCode, accountNumber]);

  if (!bankCode || accountNumber.length !== 10) return null;

  return (
    <div className="min-h-[1.25rem]">
      {isPending && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="w-3 h-3 border-2 border-border-strong border-t-muted-foreground rounded-full animate-spin" />
          Verifying account…
        </p>
      )}
      {isSuccess && data && (
        <p className="text-xs text-status-positive flex items-start gap-1.5">
          <svg
            className="w-3.5 h-3.5 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{data.account_name}</span>
        </p>
      )}
      {isError && (
        <p className="text-xs text-status-exception">
          {(error as ApiError)?.response?.data?.message ?? 'Could not verify account. Check the details and try again.'}
        </p>
      )}
    </div>
  );
}