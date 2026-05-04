// src/components/storefront/CheckoutModal.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface ApiError {
  response?: { data?: { message?: string } };
}

interface CheckoutModalProps {
  productId: string;
  productTitle: string;
  priceCents: number;
  isFree: boolean;
  affiliateCode?: string;
  onClose: () => void;
}

interface CouponResponse {
  discounted_price_cents: number;
  discount_percent?: number;
}

interface PaymentResponse {
  paymentUrl?: string;
  free?: boolean;
}

const formatNGN = (cents: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(cents / 100);

export default function CheckoutModal({
  productId,
  productTitle,
  priceCents,
  isFree,
  affiliateCode,
  onClose,
}: CheckoutModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const effectivePrice = discountedPrice ?? priceCents;

  // Coupon mutation
  const couponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post<CouponResponse>('/coupons/apply', {
        code,
        product_id: productId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setDiscountedPrice(data.discounted_price_cents);
      setAppliedCoupon(couponCode.trim().toUpperCase());
      setCouponError('');
    },
    onError: (error: ApiError) => {
      setCouponError(
        error?.response?.data?.message ?? 'Invalid or expired coupon code.'
      );
      setDiscountedPrice(null);
      setAppliedCoupon(null);
    },
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = { product_id: productId };
      if (appliedCoupon) payload.coupon_code = appliedCoupon;
      if (affiliateCode) payload.affiliate_code = affiliateCode;

      const res = await api.post<PaymentResponse>('/payments/initiate', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.free) {
        setPaymentSuccess(true);
      } else if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
  });

  const handleApplyCoupon = () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponError('');
    couponMutation.mutate(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountedPrice(null);
    setCouponCode('');
    setCouponError('');
  };

  // Success state
  if (paymentSuccess) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-surface border border-[var(--border)] rounded-2xl p-8 w-full max-w-md text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-syne font-bold">You&apos;re in!</h2>
          <p className="text-[var(--muted)] text-sm">
            Check your email — your download link is on its way.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 transition-all duration-150"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-[var(--border)] rounded-2xl p-6 w-full max-w-md space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-syne font-bold leading-tight">{productTitle}</h2>
            <p className="font-mono text-2xl font-bold text-brand mt-1">
              {effectivePrice === 0 ? 'Free' : formatNGN(effectivePrice)}
            </p>
            {discountedPrice !== null && discountedPrice < priceCents && (
              <p className="text-xs text-[var(--muted)] line-through font-mono">
                {formatNGN(priceCents)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-white transition-colors mt-0.5 shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[var(--border)]" />

        {/* Coupon section — only show if not free */}
        {!isFree && (
          <div className="space-y-2">
            <label className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Coupon code
            </label>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-400 font-mono font-semibold">{appliedCoupon}</span>
                  <span className="text-xs text-green-400/70">applied</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[var(--muted)] hover:text-white text-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  placeholder="SUMMER20"
                  className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-brand/50 transition-colors font-mono tracking-wider"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponMutation.isPending || !couponCode.trim()}
                  className="px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] hover:border-brand/50 text-sm text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap font-syne font-semibold"
                >
                  {couponMutation.isPending ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking
                    </span>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-xs text-red-400">{couponError}</p>
            )}
          </div>
        )}

        {/* Payment error */}
        {paymentMutation.isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {(paymentMutation.error as ApiError)?.response?.data?.message ??
              'Something went wrong. Try again.'}
          </div>
        )}

        {/* Pay button */}
        <button
          onClick={() => paymentMutation.mutate()}
          disabled={paymentMutation.isPending}
          className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3.5 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {paymentMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </span>
          ) : isFree || effectivePrice === 0 ? (
            'Get for free'
          ) : (
            `Pay ${formatNGN(effectivePrice)}`
          )}
        </button>

        <p className="text-xs text-center text-[var(--muted)]">
          Secured by Paystack · SSL encrypted
        </p>
      </div>
    </div>
  );
}