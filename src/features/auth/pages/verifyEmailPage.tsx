"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useResendVerification } from "@/features/auth/api/useResendVerification";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [resendSent, setResendSent] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const { mutate, isPending, isError, errorMessage } = useResendVerification();

  const handleResend = () => mutate(undefined, { onSuccess: () => setResendSent(true) });

  const renderResendPrompt = () => {
    if (resendSent) {
      return (
        <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm font-inter">
          A new verification email has been sent. Check your inbox.
        </div>
      );
    }

    if (!showResend) {
      return (
        <button
          onClick={() => setShowResend(true)}
          className="text-[var(--muted)] hover:text-white font-inter text-sm transition-colors"
        >
          Didn&apos;t receive it?{" "}
          <span className="text-brand font-medium">Resend</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleResend}
        disabled={isPending}
        className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-6 py-3 transition-colors text-sm flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          "Resend verification email"
        )}
      </button>
    );
  };

  if (!error) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface border border-[var(--border)] rounded-2xl p-7 text-center">
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="font-syne font-extrabold text-white text-xl">Check your email</h1>
              <p className="text-[var(--muted)] font-inter text-sm">
                We sent a verification link to your inbox. Click it to activate your account.
              </p>
            </div>

            {renderResendPrompt()}

            {isError && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-inter text-left">
                {errorMessage}
              </div>
            )}

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
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="font-syne font-extrabold text-white text-xl">
              {error === "missing" ? "No verification token" : "Link expired or invalid"}
            </h1>
            <p className="text-[var(--muted)] font-inter text-sm">
              {error === "missing"
                ? "Open the link from your verification email to activate your account."
                : "This verification link has expired or already been used."}
            </p>
          </div>

          {error !== "missing" && renderResendPrompt()}

          {isError && (
            <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm font-inter text-left">
              {errorMessage}
            </div>
          )}

          <Link href="/login" className="text-[var(--muted)] hover:text-white font-inter text-sm transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}