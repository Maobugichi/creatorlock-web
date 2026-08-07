'use client';

import { useState, useRef } from 'react';
import api from '@/lib/api';
import { formatNGN } from '@/lib/utils';
import { CouponResult } from '@/types/store';
import { AxiosError } from 'axios';

interface CouponFieldProps {
  productId: string;
  originalPriceCents: number;
  onApplied: (result: CouponResult) => void;
  onCleared: () => void;
  onCodeChange?: (code: string) => void;
}

type FieldState = 'idle' | 'loading' | 'applied' | 'error';

export default function CouponField({
  productId,
  originalPriceCents,
  onApplied,
  onCleared,
  onCodeChange,
}: CouponFieldProps) {
  const [code, setCode] = useState('');
  const [state, setState] = useState<FieldState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [applied, setApplied] = useState<CouponResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setState('loading');
    setErrorMsg('');

    try {
      const { data } = await api.post<{ success: boolean; data: CouponResult }>(
        '/coupons/apply',
        { code: trimmed, product_id: productId },
      );

      if (!data.success) throw new Error('Invalid coupon');

      setApplied(data.data);
      setState('applied');
      onApplied(data.data);
      onCodeChange?.(trimmed);
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? 'Invalid coupon code')
          : 'Invalid coupon code';
      setErrorMsg(msg);
      setState('error');
    }
  };

  const handleClear = () => {
    setCode('');
    setApplied(null);
    setState('idle');
    setErrorMsg('');
    onCleared();
    onCodeChange?.('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  if (state === 'applied' && applied) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-status-positive/30 bg-status-positive/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-status-positive" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <span className="font-mono text-xs font-medium text-status-positive">
              {code.trim().toUpperCase()}
            </span>
            <span className="ml-2 font-inter text-xs text-status-positive/70">
              −{formatNGN(applied.discount_cents)} off
            </span>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="font-inter text-xs text-muted-foreground transition-colors hover:text-surface-foreground"
          type="button"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (state === 'error') { setState('idle'); setErrorMsg(''); }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Coupon code"
          maxLength={32}
          disabled={state === 'loading'}
          className={`flex-1 rounded-xl border bg-transparent px-3 py-2.5 font-mono text-sm text-surface-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-border-strong disabled:opacity-50 ${
            state === 'error' ? 'border-status-exception/50' : 'border-border'
          }`}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || state === 'loading'}
          type="button"
          className="rounded-xl border border-border bg-surface px-4 py-2.5 font-inter text-xs font-medium text-surface-foreground transition-all hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state === 'loading' ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            'Apply'
          )}
        </button>
      </div>

      {state === 'error' && errorMsg && (
        <p className="font-inter text-xs text-status-exception">{errorMsg}</p>
      )}
    </div>
  );
}