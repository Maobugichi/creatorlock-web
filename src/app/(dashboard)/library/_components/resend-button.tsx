'use client';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiError } from '../_types';

interface ResendButtonProps {
  purchaseId: string;
}

export function ResendButton({ purchaseId }: ResendButtonProps) {
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: () => api.post(`/buyer/library/${purchaseId}/resend`),
  });

  return (
    <div className="flex flex-col items-end gap-1">
      {isError && (
        <p className="text-xs text-red-400">
          {(error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
        </p>
      )}

      <button
        onClick={() => mutate()}
        disabled={isPending || isSuccess}
        className="flex items-center gap-1.5 text-sm bg-[var(--bg)] border border-[var(--border)] hover:border-brand/40 text-white font-syne font-semibold rounded-xl px-4 py-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : isSuccess ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Sent!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Resend link
          </>
        )}
      </button>
    </div>
  );
}