'use client';
// ─────────────────────────────────────────────
//  CreatorLock — CouponField
//  src/components/checkout/CouponField.tsx
//
//  Calls POST /coupons/apply (no auth required)
//  Payload:  { code: string, product_id: string }
//  Response: { success, data: CouponResult }
// ─────────────────────────────────────────────
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

  // ── Applied state ─────────────────────────
  if (state === 'applied' && applied) {
    return (
      <div
        className="flex items-center justify-between rounded-xl border px-4 py-3"
        style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)' }}
      >
        <div className="flex items-center gap-2">
          {/* Checkmark */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <span className="font-mono text-xs font-medium text-emerald-400">
              {code.trim().toUpperCase()}
            </span>
            <span className="ml-2 font-inter text-xs text-emerald-400/70">
              −{formatNGN(applied.discount_cents)} off
            </span>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="font-inter text-xs text-white/40 transition-colors hover:text-white/80"
          type="button"
        >
          Remove
        </button>
      </div>
    );
  }

  // ── Input state ───────────────────────────
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
          className="flex-1 rounded-xl border bg-transparent px-3 py-2.5 font-mono text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-white/20 disabled:opacity-50"
          style={{ borderColor: state === 'error' ? 'rgba(239,68,68,0.5)' : 'var(--border)' }}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || state === 'loading'}
          type="button"
          className="rounded-xl border px-4 py-2.5 font-inter text-xs font-medium text-white transition-all hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: 'var(--border)', background: 'var(--color-surface)' }}
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

      {/* Error message */}
      {state === 'error' && errorMsg && (
        <p className="font-inter text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}