"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useResendVerification } from "@/features/auth/api/useResendVerification";

export default function VerifyEmailPendingPage() {
  const [resent, setResent] = useState(false);
  const { mutate, isPending } = useResendVerification();

  const handleResend = () =>
    mutate(undefined, { onSuccess: () => setResent(true) });

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand"/>
            <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand"/>
          </svg>
        </div>

        <h1 className="font-syne font-extrabold text-2xl text-white mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-white/30 mb-8 leading-relaxed">
          We sent a verification link to your email. Click it to continue setting up your account.
        </p>

        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs text-white/20 mb-4 font-inter">
            Didn&apos;t get it? Check your spam folder or resend.
          </p>
          <button
            onClick={handleResend}
            disabled={isPending || resent}
            className="w-full border border-white/10 hover:border-white/20 disabled:opacity-40 text-white/60 hover:text-white font-medium rounded-xl py-3 text-sm transition-colors font-inter"
          >
            {resent ? "Email resent ✓" : isPending ? "Resending..." : "Resend verification email"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}