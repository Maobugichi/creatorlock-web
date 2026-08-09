'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { formatNGN } from '@/lib/utils';
import { ProductWithFiles, CouponResult, InitiatePaymentResult } from '@/types/store';
import CouponField from './CouponField';
import { getAffiliateRef, clearAffiliateRef } from '@/lib/affiliateRef';
import { AxiosError } from 'axios';
import api from '@/lib/api';

interface CheckoutModalProps {
  product: ProductWithFiles;
  onClose: () => void;
}

type Step = 'review' | 'email' | 'paying' | 'free_ok' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useFocusTrap(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    return () => { prev?.focus(); };
  }, [active]);
}

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

  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [couponCode, setCouponCode] = useState('');

  const [guestEmail, setGuestEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const displayPriceCents = couponResult
    ? couponResult.final_price_cents
    : product.price_cents;
  const isEffectivelyFree = displayPriceCents === 0;

  const [step, setStep] = useState<Step>('review');
  const [errorMsg, setErrorMsg] = useState('');

  useFocusTrap(true);
  useScrollLock(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'paying') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, onClose]);

  const handleCouponApplied = useCallback((result: CouponResult) => {
    setCouponResult(result);
  }, []);

  const handleCouponCleared = useCallback(() => {
    setCouponResult(null);
    setCouponCode('');
  }, []);

  const submitPurchase = async (email?: string) => {
    setStep('paying');
    setErrorMsg('');

    try {
      const payload: Record<string, string> = {
        product_id: product.id,
      };

      if (couponResult && couponCode) {
        payload.coupon_code = couponCode;
      }

      const affiliateRef = getAffiliateRef();
      if (affiliateRef) {
        payload.affiliate_code = affiliateRef;
      }

      if (!isAuthenticated && email) {
        payload.guest_email = email;
      }

      const { data } = await api.post<{
        success: boolean;
        message: string;
        data: InitiatePaymentResult;
      }>('/payments/initiate', payload);

      if (!data.success) throw new Error(data.message);

      const result = data.data;

      if (result.free || result.paymentUrl === null) {
        clearAffiliateRef()
        setStep('free_ok');
        return;
      }

      clearAffiliateRef()
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

  const handlePurchase = async () => {
    if (!isAuthenticated && !guestEmail) {
      setStep('email');
      return;
    }

    await submitPurchase(guestEmail || undefined);
  };

  const handleEmailSubmit = async () => {
    const trimmed = emailInput.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('Enter a valid email address');
      return;
    }

    setEmailError('');
    setGuestEmail(trimmed);
    await submitPurchase(trimmed);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && step !== 'paying') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-5 bg-elevated border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {step !== 'paying' && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-muted-foreground transition-colors hover:text-surface-foreground"
            aria-label="Close"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {step === 'review' && (
          <>
            <div>
              <p className="font-inter text-xs mb-1 text-muted-foreground">
                You&apos;re purchasing
              </p>
              <h2 className="font-syne text-lg font-extrabold text-surface-foreground leading-snug pr-8">
                {product.title}
              </h2>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
              <span className="font-inter text-sm text-muted-foreground">Total</span>
              <div className="text-right">
                {couponResult && couponResult.discount_cents > 0 && (
                  <p className="font-mono text-xs line-through text-muted-foreground">
                    {formatNGN(product.price_cents)}
                  </p>
                )}
                <p className="font-syne text-xl font-extrabold text-surface-foreground">
                  {isEffectivelyFree || isFree ? (
                    <span className="text-price">Free</span>
                  ) : (
                    formatNGN(displayPriceCents)
                  )}
                </p>
              </div>
            </div>

            {!isFree && (
              <div>
                <p className="font-inter text-xs mb-2 text-muted-foreground">
                  Have a coupon?
                </p>
                <CouponField
                  productId={product.id}
                  originalPriceCents={product.price_cents}
                  onApplied={(result) => {
                    handleCouponApplied(result);
                  }}
                  onCleared={handleCouponCleared}
                  onCodeChange={setCouponCode}
                />
              </div>
            )}

            <button
              onClick={handlePurchase}
              type="button"
              className="w-full rounded-xl py-3.5 font-syne text-sm font-bold text-price-foreground bg-price transition-opacity hover:opacity-90 active:opacity-80"
            >
              {isFree || isEffectivelyFree
                ? 'Claim for Free'
                : `Pay ${formatNGN(displayPriceCents)}`}
            </button>

            <p className="text-center font-inter text-xs text-muted-foreground">
              Secure checkout · Instant delivery via email
            </p>
          </>
        )}

        {step === 'email' && (
          <>
            <div>
              <p className="font-inter text-xs mb-1 text-muted-foreground">
                Almost there
              </p>
              <h2 className="font-syne text-lg font-extrabold text-surface-foreground leading-snug pr-8">
                Where should we send it?
              </h2>
              <p className="mt-1.5 font-inter text-sm text-muted-foreground">
                We&apos;ll send your download link and receipt to this email.
              </p>
            </div>

            <div>
              <input
                type="email"
                inputMode="email"
                autoFocus
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEmailSubmit();
                }}
                placeholder="you@example.com"
                className={`w-full rounded-xl border bg-surface px-4 py-3.5 font-inter text-sm text-surface-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary ${
                  emailError ? 'border-status-exception' : 'border-border'
                }`}
              />
              {emailError && (
                <p className="mt-1.5 font-inter text-xs text-status-exception">{emailError}</p>
              )}
            </div>

            <button
              onClick={handleEmailSubmit}
              type="button"
              className="w-full rounded-xl py-3.5 font-syne text-sm font-bold text-price-foreground bg-price transition-opacity hover:opacity-90 active:opacity-80"
            >
              {isFree || isEffectivelyFree
                ? 'Claim for Free'
                : `Pay ${formatNGN(displayPriceCents)}`}
            </button>

            <button
              onClick={() => setStep('review')}
              type="button"
              className="text-center font-inter text-xs text-muted-foreground transition-colors hover:text-surface-foreground"
            >
              ← Back
            </button>
          </>
        )}

        {step === 'paying' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <svg
              className="animate-spin text-price"
              width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="font-inter text-sm text-muted-foreground">
              {isEffectivelyFree || isFree
                ? 'Claiming your product…'
                : 'Redirecting to payment…'}
            </p>
          </div>
        )}

        {step === 'free_ok' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-status-positive/[0.12] border border-status-positive/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-status-positive" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-syne text-lg font-extrabold text-surface-foreground">You&apos;re all set!</h3>
              <p className="mt-1.5 font-inter text-sm text-muted-foreground">
                Check your email for the download link. It may take a moment to arrive.
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="mt-2 w-full rounded-xl py-3 font-syne text-sm font-bold text-primary-foreground bg-primary transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-status-exception/10 border border-status-exception/25">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-status-exception" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h3 className="font-syne text-base font-extrabold text-surface-foreground">Something went wrong</h3>
              <p className="mt-1.5 font-inter text-sm text-status-exception">{errorMsg}</p>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                type="button"
                className="flex-1 rounded-xl border border-border bg-surface py-3 font-inter text-sm text-muted-foreground transition-colors hover:text-surface-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('review')}
                type="button"
                className="flex-1 rounded-xl py-3 font-syne text-sm font-bold text-primary-foreground bg-primary transition-opacity hover:opacity-90"
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