'use client';

import { useCoupons } from '../_hooks/useCoupons';
import { extractApiError } from '../_lib/formatters';
import { CreateCouponForm } from './create-coupon-form';
import { CouponRow } from './coupon-row';
import { SkeletonRow } from './skeleton-row';

export function CouponsClient() {
  const { coupons, isLoading, isError, error } = useCoupons();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-syne font-extrabold">Coupons</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Create and manage discount codes for your products.
        </p>
      </div>

      <CreateCouponForm />

      <div className="space-y-3">
        <h2 className="font-syne font-bold text-lg">Your coupons</h2>

        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
            {extractApiError(error)}
          </div>
        )}

        <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
          {isLoading && <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}

          {!isLoading && !isError && coupons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-2">
              <p className="font-syne font-semibold text-white">No coupons yet</p>
              <p className="text-sm text-[var(--muted)]">
                Create your first coupon above to start offering discounts.
              </p>
            </div>
          )}

          {!isLoading && coupons.length > 0 && (
            <ul>
              {coupons.map((coupon) => (
                <CouponRow key={coupon.id} coupon={coupon} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}