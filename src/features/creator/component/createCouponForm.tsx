// CreateCouponForm.tsx
'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useCreateCoupon } from '../api/useCreateCoupon';
import { extractApiError } from '../utils/coupon.utils';
import type { CreateCouponPayload } from '../types/coupon.types';
import DatePicker from '@/components/ui/datePicker';

export function CreateCouponForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate: create, isPending, isError, error, isSuccess } = useCreateCoupon(
    () => {
      formRef.current?.reset();
      setDiscountType('percent');
    }
  );

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    const data = new FormData(e.currentTarget);

    const discount_value = parseFloat(data.get('discount_value') as string);
    const type = data.get('discount_type') as 'percent' | 'flat';

    if (type === 'percent' && discount_value > 100) {
      setLocalError('Percentage discount can\'t be more than 100%.');
      return;
    }

    const payload: CreateCouponPayload = {
      code: (data.get('code') as string).trim().toUpperCase(),
      discount_type: type,
      discount_value,
      ...(data.get('max_uses') && { max_uses: parseInt(data.get('max_uses') as string, 10) }),
      ...(data.get('expires_at') && { expires_at: data.get('expires_at') as string }),
    };

    create(payload);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
      <h2 className="font-syne font-bold text-base">Create coupon</h2>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {(isError || localError) && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-status-exception/10 border border-status-exception/20 rounded-xl px-5 py-4 text-sm text-status-exception"
            >
              {localError ?? extractApiError(error)}
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="bg-status-positive/10 border border-status-positive/20 rounded-xl px-5 py-4 text-sm text-status-positive"
            >
              Coupon created successfully.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="code" className="text-xs text-muted-foreground uppercase tracking-widest block">
              Code
            </label>
            <input
              id="code" name="code" type="text" required placeholder="SUMMER20"
              onChange={(e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''); }}
              className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-surface-foreground placeholder:text-muted-foreground font-mono tracking-wider focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discount_type" className="text-xs text-muted-foreground uppercase tracking-widest block">
              Discount type
            </label>
            <select
              id="discount_type" name="discount_type" required
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percent' | 'flat')}
              className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-surface-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat amount (₦)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discount_value" className="text-xs text-muted-foreground uppercase tracking-widest block">
              Discount value
            </label>
            <div className="relative">
              <input
                id="discount_value" name="discount_value" type="number" required min={1}
                max={discountType === 'percent' ? 100 : undefined}
                placeholder="20"
                onChange={() => setLocalError(null)}
                className="w-full bg-elevated border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-surface-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                {discountType === 'percent' ? '%' : '₦'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="max_uses" className="text-xs text-muted-foreground uppercase tracking-widest block">
              Max uses <span className="normal-case text-muted-foreground">(optional)</span>
            </label>
            <input
              id="max_uses" name="max_uses" type="number" min={1} placeholder="Leave blank for unlimited"
              className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-surface-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-widest block">
            Expiry date <span className="normal-case text-muted-foreground">(optional)</span>
          </label>
          <DatePicker name="expires_at" minDate={new Date().toISOString().split('T')[0]} />
        </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit" disabled={isPending}
          aria-busy={isPending}
          className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
              <span>Creating…</span>
            </span>
          ) : 'Create coupon'}
        </motion.button>
      </form>
    </div>
  );
}