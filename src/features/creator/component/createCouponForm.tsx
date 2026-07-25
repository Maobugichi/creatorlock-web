// CreateCouponForm.tsx
'use client';

import { useRef, useState } from 'react';
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
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <h2 className="font-syne font-bold text-base">Create coupon</h2>

      <div aria-live="polite">
        {(isError || localError) && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
            {localError ?? extractApiError(error)}
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 text-sm text-green-400">
            Coupon created successfully.
          </div>
        )}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="code" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Code
            </label>
            <input
              id="code" name="code" type="text" required placeholder="SUMMER20"
              onChange={(e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''); }}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono tracking-wider focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discount_type" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Discount type
            </label>
            <select
              id="discount_type" name="discount_type" required
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percent' | 'flat')}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-colors"
            >
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat amount (₦)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discount_value" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Discount value
            </label>
            <div className="relative">
              <input
                id="discount_value" name="discount_value" type="number" required min={1}
                max={discountType === 'percent' ? 100 : undefined}
                placeholder="20"
                onChange={() => setLocalError(null)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] pointer-events-none">
                {discountType === 'percent' ? '%' : '₦'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="max_uses" className="text-xs text-[var(--muted)] uppercase tracking-widest block">
              Max uses <span className="normal-case text-[var(--muted)]">(optional)</span>
            </label>
            <input
              id="max_uses" name="max_uses" type="number" min={1} placeholder="Leave blank for unlimited"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] font-mono focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
          <label className="text-xs text-[var(--muted)] uppercase tracking-widest block">
            Expiry date <span className="normal-case text-[var(--muted)]">(optional)</span>
          </label>
          <DatePicker name="expires_at" minDate={new Date().toISOString().split('T')[0]} />
        </div>
        </div>

        <button
          type="submit" disabled={isPending}
          aria-busy={isPending}
          className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              <span>Creating…</span>
            </span>
          ) : 'Create coupon'}
        </button>
      </form>
    </div>
  );
}