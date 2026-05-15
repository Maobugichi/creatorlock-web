'use client';

import { useToggleCoupon } from '../_hooks/useToggleCoupon';
import { useDeleteCoupon } from '../_hooks/useDeleteCoupons';
import { formatDiscountLabel, formatExpiryLabel, extractApiError } from '../_lib/formatters';
import type { Coupon } from '../_lib/type';

export function CouponRow({ coupon }: { coupon: Coupon }) {
  const { mutate: toggleActive, isPending: toggling } = useToggleCoupon(coupon.id);

  const {
    mutate: deleteCoupon,
    isPending: deleting,
    isError: deleteError,
    error: deleteErr,
    reset: resetDelete,
    variables: deleteVars,
  } = useDeleteCoupon(coupon.id);

  const isPendingConfirm = !deleting && deleteVars === false;
  const discountLabel = formatDiscountLabel(coupon);
  const expiryLabel = formatExpiryLabel(coupon.expires_at);

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-mono font-bold text-white tracking-wider">{coupon.code}</p>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          {discountLabel}
          {coupon.max_uses !== null && ` · ${coupon.used_count}/${coupon.max_uses} uses`}
          {coupon.max_uses === null && coupon.used_count > 0 && ` · ${coupon.used_count} uses`}
          {expiryLabel && ` · Expires ${expiryLabel}`}
        </p>
        {deleteError && (
          <p className="text-xs text-red-400 mt-1">{extractApiError(deleteErr)}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          coupon.active
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-white/5 text-[var(--muted)] border-white/10'
        }`}>
          {coupon.active ? 'Active' : 'Inactive'}
        </span>

        <button
          onClick={() => toggleActive()}
          disabled={toggling}
          className="text-xs bg-[var(--bg)] border border-[var(--border)] hover:border-brand/40 text-white font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {toggling ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
          ) : coupon.active ? 'Deactivate' : 'Activate'}
        </button>

        {isPendingConfirm ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => deleteCoupon(true)}
              disabled={deleting}
              className="text-xs bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40"
            >
              {deleting ? (
                <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
              ) : 'Confirm'}
            </button>
            <button
              onClick={() => resetDelete()}
              className="text-xs text-[var(--muted)] hover:text-white font-syne font-semibold px-2 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => deleteCoupon(false)}
            disabled={deleting}
            className="text-xs bg-[var(--bg)] border border-[var(--border)] hover:border-red-500/40 text-[var(--muted)] hover:text-red-400 font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}