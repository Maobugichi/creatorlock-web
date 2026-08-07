// CouponsPage.tsx
'use client';

import { useCoupons } from '../api/useCoupon';
import { extractApiError } from '../utils/coupon.utils';
import { CreateCouponForm } from '../component/createCouponForm';
import { CouponRow } from '../component/couponRow';
import { SkeletonRow } from '../component/couponSkeletonRow';

export default function CouponsPage() {
  const { coupons, isLoading, isError, error } = useCoupons();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-syne font-extrabold">Coupons</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and manage discount codes for your products.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-syne font-bold text-lg">Your coupons</h2>

        {isError && (
          <div className="bg-status-exception/10 border border-status-exception/20 rounded-xl px-5 py-4 text-sm text-status-exception">
            {extractApiError(error)}
          </div>
        )}

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {isLoading && <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}

          {!isLoading && !isError && coupons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-2">
              <p className="font-syne font-semibold text-surface-foreground">No coupons yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first coupon below to start offering discounts.
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

      <CreateCouponForm />
    </div>
  );
}