'use client';

import { useEffect, useRef } from 'react';
import { useResolveAccount } from '../api/useResolveAccount';
import type { ApiError } from '../types/payout.types';

interface AccountResolverProps {
  bankCode: string;
  accountNumber: string;
  onResolved: (name: string) => void;
  onReset: () => void;
}

export function AccountResolver({ bankCode, accountNumber, onResolved, onReset }: AccountResolverProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKeyRef = useRef('');

  const { mutate, isPending, isSuccess, isError, error, reset, data } = useResolveAccount(
    onResolved,
    onReset,
  );

  useEffect(() => {
    const key = `${bankCode}:${accountNumber}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    onReset();
    reset();

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
        <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
          <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          Verifying account…
        </p>
      )}
      {isSuccess && data && (
        <p className="text-xs text-green-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {data.account_name}
        </p>
      )}
      {isError && (
        <p className="text-xs text-red-400">
          {(error as ApiError)?.response?.data?.message ?? 'Could not verify account. Check the details and try again.'}
        </p>
      )}
    </div>
  );
}