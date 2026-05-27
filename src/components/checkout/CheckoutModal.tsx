'use client';
// ─────────────────────────────────────────────
//  CreatorLock — CheckoutModal
//  src/components/checkout/CheckoutModal.tsx
//
//  Step flow:
//   1. REVIEW   — price + optional coupon field
//   2. PAYING   — POST /payments/initiate
//   3. FREE_OK  — free product claimed, check email
//   4. ERROR    — surface error with retry
//
//  Auth: getAccessToken() from @/lib/api
//  If no token → redirect /login?next=current URL
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { formatNGN } from '@/lib/utils';
import { ProductWithFiles, CouponResult, InitiatePaymentResult } from '@/types/store';
import CouponField from './CouponField';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface CheckoutModalProps {
  product: ProductWithFiles;
  onClose: () => void;
}

type Step = 'review' | 'paying' | 'free_ok' | 'error';

// ── Trap focus inside modal ───────────────────
function useFocusTrap(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    return () => { prev?.focus(); };
  }, [active]);
}

// ── Lock body scroll while modal is open ─────
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [active]);
}

export default function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated } = useAuthStore();

  const isFree = product.price_cents === 0;

  // Coupon state
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [couponCode, setCouponCode] = useState('');

  // Derived price
  const displayPriceCents = couponResult
    ? couponResult.final_price_cents
    : product.price_cents;
  const isEffectivelyFree = displayPriceCents === 0;

  // Step machine
  const [step, setStep] = useState<Step>('review');
  const [errorMsg, setErrorMsg] = useState('');

  useFocusTrap(true);
  useScrollLock(true);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'paying') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, onClose]);

  const handleCouponApplied = useCallback((result: CouponResult) => {
    setCouponResult(result);
    // Store code for submission — CouponField uppercases it internally
  }, []);

  const handleCouponCleared = useCallback(() => {
    setCouponResult(null);
    setCouponCode('');
  }, []);

  // ── Main purchase handler ─────────────────
  const handlePurchase = async () => {
    // Auth gate — must have access token
   
    if (!isAuthenticated) {  // was: getAccessToken()
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setStep('paying');
    setErrorMsg('');

    try {
      const payload: Record<string, string> = {
        product_id: product.id,
      };

      // Only send coupon_code if one was successfully applied
      if (couponResult && couponCode) {
        payload.coupon_code = couponCode;
      }

      const { data } = await api.post<{
        success: boolean;
        message: string;
        data: InitiatePaymentResult;
      }>('/payments/initiate', payload);

      if (!data.success) throw new Error(data.message);

      const result = data.data;

      if (result.free || result.paymentUrl === null) {
        
        setStep('free_ok');
        return;
      }

      // Paid — redirect to Paystack
      window.location.href = result.paymentUrl!;
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? 'Something went wrong')
          : err instanceof Error
          ? err.message
          : 'Something went wrong';
      setErrorMsg(msg);
      setStep('error');
    }
  };

  // ── Backdrop click ────────────────────────
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && step !== 'paying') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: '#111111', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ───────────────────── */}
        {step !== 'paying' && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:text-white/80"
            style={{ background: 'var(--color-surface)' }}
            aria-label="Close"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* ══════════════════════════════════════
            STEP: REVIEW
        ══════════════════════════════════════ */}
        {step === 'review' && (
          <>
            <div>
              <p className="font-inter text-xs mb-1" style={{ color: 'var(--muted)' }}>
                You&apos;re purchasing
              </p>
              <h2 className="font-syne text-lg font-extrabold text-white leading-snug pr-8">
                {product.title}
              </h2>
            </div>

            {/* Price block */}
            <div
              className="rounded-xl border p-4 flex items-center justify-between"
              style={{ borderColor: 'var(--border)', background: 'var(--color-surface)' }}
            >
              <span className="font-inter text-sm" style={{ color: 'var(--muted)' }}>Total</span>
              <div className="text-right">
                {/* Show strikethrough original if coupon applied */}
                {couponResult && couponResult.discount_cents > 0 && (
                  <p className="font-mono text-xs line-through" style={{ color: 'var(--muted)' }}>
                    {formatNGN(product.price_cents)}
                  </p>
                )}
                <p className="font-syne text-xl font-extrabold text-white">
                  {isEffectivelyFree || isFree ? (
                    <span className="text-emerald-400">Free</span>
                  ) : (
                    formatNGN(displayPriceCents)
                  )}
                </p>
              </div>
            </div>

            {/* Coupon field — only show for paid products */}
            {!isFree && (
              <div>
                <p className="font-inter text-xs mb-2" style={{ color: 'var(--muted)' }}>
                  Have a coupon?
                </p>
                <CouponField
                  productId={product.id}
                  originalPriceCents={product.price_cents}
                  onApplied={(result) => {
                    handleCouponApplied(result);
                    // Track the code string for submission
                    // CouponField uppercases internally; we read from its state via callback
                  }}
                  onCleared={handleCouponCleared}
                  onCodeChange={setCouponCode}
                />
              </div>
            )}

            {/* Auth hint if no token */}
            {!isAuthenticated && (
              <div
                className="flex items-center gap-2.5 rounded-xl border px-4 py-3"
                style={{ borderColor: 'rgba(251,92,6,0.25)', background: 'rgba(251,92,6,0.06)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB5C06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="font-inter text-xs" style={{ color: 'rgba(251,92,6,0.9)' }}>
                  You&apos;ll be asked to log in before completing your purchase.
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handlePurchase}
              type="button"
              className="w-full rounded-xl py-3.5 font-syne text-sm font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
              style={{ background: 'var(--color-brand)' }}
            >
              {isFree || isEffectivelyFree
                ? 'Claim for Free'
                : `Pay ${formatNGN(displayPriceCents)}`}
            </button>

            <p className="text-center font-inter text-xs" style={{ color: 'var(--muted)' }}>
              Secure checkout · Instant delivery via email
            </p>
          </>
        )}

        {/* ══════════════════════════════════════
            STEP: PAYING (spinner)
        ══════════════════════════════════════ */}
        {step === 'paying' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <svg
              className="animate-spin"
              width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-brand)" strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="font-inter text-sm" style={{ color: 'var(--muted)' }}>
              {isEffectivelyFree || isFree
                ? 'Claiming your product…'
                : 'Redirecting to payment…'}
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP: FREE_OK
        ══════════════════════════════════════ */}
        {step === 'free_ok' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-syne text-lg font-extrabold text-white">You&apos;re all set!</h3>
              <p className="mt-1.5 font-inter text-sm" style={{ color: 'var(--muted)' }}>
                Check your email for the download link. It may take a moment to arrive.
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="mt-2 w-full rounded-xl py-3 font-syne text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-brand)' }}
            >
              Done
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP: ERROR
        ══════════════════════════════════════ */}
        {step === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h3 className="font-syne text-base font-extrabold text-white">Something went wrong</h3>
              <p className="mt-1.5 font-inter text-sm text-red-400">{errorMsg}</p>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                type="button"
                className="flex-1 rounded-xl border py-3 font-inter text-sm text-white/60 transition-colors hover:text-white"
                style={{ borderColor: 'var(--border)', background: 'var(--color-surface)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('review')}
                type="button"
                className="flex-1 rounded-xl py-3 font-syne text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-brand)' }}
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}