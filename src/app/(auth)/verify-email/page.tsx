'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';

interface ApiError {
  response?: { data?: { message?: string } };
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Derive initial status from token presence — no setState needed for no-token case
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [resendSent, setResendSent] = useState(false);

  const confirmMutation = useMutation({
    mutationFn: (t: string) => api.post('/auth/verify-email/confirm', { token: t }),
    onSuccess: () => setStatus('success'),
    onError: () => setStatus('error'),
  });

  const resendMutation = useMutation({
    mutationFn: () => api.post('/auth/verify-email/send'),
    onSuccess: () => setResendSent(true),
  });

  useEffect(() => {
    if (!token) return; // no-token is rendered below based on !token directly
    confirmMutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No-token: render immediately without any state or effect
  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface border border-[var(--border)] rounded-2xl p-7 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="font-syne font-extrabold text-white text-xl">No verification token</h1>
              <p className="text-[var(--muted)] font-inter text-sm">
                Open the link from your verification email to activate your account.
              </p>
            </div>
            <Link href="/login" className="text-[var(--muted)] hover:text-white font-inter text-sm transition-colors">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-7 text-center">

        {/* Verifying state */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] border-t-brand animate-spin" />
            <p className="text-[var(--muted)] font-inter text-sm">Verifying your email…</p>
          </div>
        )}

        {/* Success state */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="font-syne font-extrabold text-white text-xl">Email verified</h1>
              <p className="text-[var(--muted)] font-inter text-sm">
                Your account is now active. You can sign in.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm"
            >
              Go to sign in
            </Link>
          </div>
        )}

        {/* Error / expired state */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="font-syne font-extrabold text-white text-xl">Link expired or invalid</h1>
              <p className="text-[var(--muted)] font-inter text-sm">
                This verification link has expired or already been used.
              </p>
            </div>

            {confirmMutation.error && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-inter text-left">
                {(confirmMutation.error as ApiError)?.response?.data?.message ?? 'Verification failed. Please try again.'}
              </div>
            )}

            {resendSent ? (
              <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm font-inter">
                A new verification email has been sent. Check your inbox.
              </div>
            ) : (
              <button
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending}
                className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm flex items-center justify-center gap-2"
              >
                {resendMutation.isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Resend verification email'
                )}
              </button>
            )}

            {resendMutation.isError && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-inter text-left">
                {(resendMutation.error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.'}
              </div>
            )}

            <Link href="/login" className="text-[var(--muted)] hover:text-white font-inter text-sm transition-colors">
              Back to sign in
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}