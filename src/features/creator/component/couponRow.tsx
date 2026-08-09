'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useToggleCoupon } from '../api/useToggleCoupon';
import { useDeleteCoupon } from '../api/useDeleteCoupon';
import { formatDiscountLabel, formatExpiryLabel, extractApiError } from '../utils/coupon.utils';
import type { Coupon } from '../types/coupon.types';

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
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-mono font-bold text-surface-foreground tracking-wider">{coupon.code}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {discountLabel}
          {coupon.max_uses !== null && ` · ${coupon.used_count}/${coupon.max_uses} uses`}
          {coupon.max_uses === null && coupon.used_count > 0 && ` · ${coupon.used_count} uses`}
          {expiryLabel && ` · Expires ${expiryLabel}`}
        </p>
        <AnimatePresence>
          {deleteError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-xs text-status-exception mt-1"
            >
              {extractApiError(deleteErr)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          coupon.active
            ? 'bg-status-positive/10 text-status-positive border-status-positive/20'
            : 'bg-elevated text-muted-foreground border-border'
        }`}>
          {coupon.active ? 'Active' : 'Inactive'}
        </span>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => toggleActive()}
          disabled={toggling}
          className={`text-xs border font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            coupon.active
              ? 'bg-status-warning/10 text-status-warning border-status-warning/20 hover:bg-status-warning/20'
              : 'bg-status-positive/10 text-status-positive border-status-positive/20 hover:bg-status-positive/20'
          }`}
        >
          {toggling ? (
            <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
          ) : coupon.active ? 'Deactivate' : 'Activate'}
        </motion.button>

        <AnimatePresence mode="popLayout" initial={false}>
          {isPendingConfirm ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => deleteCoupon(true)}
                disabled={deleting}
                className="text-xs bg-status-exception/10 border border-status-exception/20 hover:bg-status-exception/20 text-status-exception font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40"
              >
                {deleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-status-exception/30 border-t-status-exception rounded-full animate-spin inline-block" />
                ) : 'Confirm'}
              </motion.button>
              <button
                onClick={() => resetDelete()}
                className="text-xs text-muted-foreground hover:text-surface-foreground font-syne font-semibold px-2 py-2 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="delete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => deleteCoupon(false)}
              disabled={deleting}
              className="text-xs bg-elevated border border-border hover:border-status-exception/40 text-muted-foreground hover:text-status-exception font-syne font-semibold rounded-xl px-3 py-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}