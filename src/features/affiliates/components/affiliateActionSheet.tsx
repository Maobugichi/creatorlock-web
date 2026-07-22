'use client';

import { useEffect, useState } from 'react';
import type { Affiliate } from '../types/affiliate.types';
import { useToggleAffiliate } from '../api/useToggleAffiliate';
import { useResendInvite } from '../api/useResendInvite';
import { useUpdateCommission } from '../api/useUpdateCommission';
import { useDeleteAffiliate } from '../api/useDeleteAffiliate';
import { StatusBadge } from '../../creator/component/statusBadge';
import { formatRelativeTime } from '@/features/shared/utils/formatRelativeTime';

const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

function useCooldownRemaining(lastSentAt: string | null): number {
  const target = lastSentAt ? new Date(lastSentAt).getTime() + RESEND_COOLDOWN_MS : 0;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (now === null) return 0;
  return Math.max(0, target - now);
}

function formatCooldown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

// Same shell pattern as CheckoutModal — bottom drawer on mobile
// (items-end, rounded-t-2xl), centered modal on desktop (sm:items-center,
// sm:rounded-2xl).
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

interface AffiliateActionSheetProps {
  affiliate: Affiliate;
  onClose: () => void;
}

export function AffiliateActionSheet({ affiliate, onClose }: AffiliateActionSheetProps) {
  useFocusTrap(true);
  useScrollLock(true);

  const { toggle, isToggling } = useToggleAffiliate(affiliate.id);
  const { resendInvite, isResending, resendError } = useResendInvite(affiliate.id);
  const { updateCommission, isUpdating } = useUpdateCommission();
  const { deleteAffiliate, isDeleting, deleteError } = useDeleteAffiliate(affiliate.id, { onSuccess: onClose });

  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingCommission, setEditingCommission] = useState(false);
  const [commissionDraft, setCommissionDraft] = useState(String(affiliate.commission_percent));

  function handleDeleteClick() {
    if (confirmingDelete) {
      deleteAffiliate();
    } else {
      setConfirmingDelete(true);
    }
  }

  const cooldownRemaining = useCooldownRemaining(affiliate.last_invite_sent_at);
  const onCooldown = cooldownRemaining > 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSaveCommission() {
    const parsed = Number(commissionDraft);
    if (!parsed || parsed < 1 || parsed > 90) return;
    updateCommission(
      { affiliateId: affiliate.id, commissionPercent: parsed },
      { onSuccess: () => setEditingCommission(false) }
    );
  }

  function handleDeactivateClick() {
    if (!affiliate.active) {
      toggle();
      return;
    }
    if (confirmingDeactivate) {
      toggle(undefined, { onSuccess: onClose });
    } else {
      setConfirmingDeactivate(true);
    }
  }

  const initials = affiliate.affiliate_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Affiliate details"
    >
      <div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-5 bg-surface border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/80 transition-colors bg-white/[0.04]"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <span className="text-brand text-sm font-syne font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{affiliate.affiliate_name}</p>
            <p className="text-[var(--muted)] text-xs truncate">{affiliate.affiliate_email}</p>
            <p className="text-[var(--muted)] text-xs opacity-60">Joined {formatRelativeTime(affiliate.created_at)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.02] border border-[var(--border)] rounded-xl p-3.5">
            <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Conversions</p>
            <p className="text-white text-lg font-mono font-semibold">{affiliate.total_conversions}</p>
            {affiliate.conversions_this_week > 0 && (
              <p className="text-green-400 text-xs font-medium mt-0.5">+{affiliate.conversions_this_week} this week</p>
            )}
          </div>

          <div className="bg-white/[0.02] border border-[var(--border)] rounded-xl p-3.5">
            <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Commission</p>
            {editingCommission ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={commissionDraft}
                  onChange={(e) => setCommissionDraft(e.target.value)}
                  autoFocus
                  className="w-14 bg-[var(--bg)] border border-brand/40 rounded-lg px-1.5 py-1 text-white text-sm font-mono focus:outline-none focus:border-brand"
                />
                <button onClick={handleSaveCommission} disabled={isUpdating} className="text-green-400" aria-label="Save">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button onClick={() => setEditingCommission(false)} className="text-[var(--muted)]" aria-label="Cancel">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <p className="text-white text-lg font-mono font-semibold">{affiliate.commission_percent}%</p>
                <button
                  onClick={() => {
                    setCommissionDraft(String(affiliate.commission_percent));
                    setEditingCommission(true);
                  }}
                  className="text-[var(--muted)] hover:text-brand"
                  aria-label="Edit commission"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.5-9.5a2.121 2.121 0 0 1 3 3L12 16l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/[0.02] border border-[var(--border)] rounded-xl p-3.5">
          <span className="text-[var(--muted)] text-xs uppercase tracking-wider">Status</span>
          <StatusBadge active={affiliate.active} />
        </div>

        <div className="flex flex-col gap-2.5 border-t border-[var(--border)] pt-5">
          <button
            onClick={() => resendInvite()}
            disabled={isResending || onCooldown}
            className="w-full text-sm font-syne font-semibold px-4 py-3 rounded-xl transition-all bg-white/[0.04] text-white border border-[var(--border)] hover:bg-white/[0.08] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isResending ? 'Resending…' : onCooldown ? `Resend available in ${formatCooldown(cooldownRemaining)}` : 'Resend Invite'}
          </button>

          {resendError && <p className="text-xs text-red-400 text-center">{resendError}</p>}

          <button
            onClick={handleDeactivateClick}
            disabled={isToggling}
            className={`w-full text-sm font-syne font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50 ${
              affiliate.active
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}
          >
            {isToggling
              ? '…'
              : confirmingDeactivate
              ? 'Tap again to confirm'
              : affiliate.active
              ? 'Deactivate Affiliate'
              : 'Activate Affiliate'}
          </button>
        </div>

        <div className="border-t border-[var(--border)] pt-5">
          {affiliate.total_conversions > 0 ? (
            <p className="text-xs text-[var(--muted)] text-center">
              This affiliate has conversion history and can&apos;t be deleted — deactivate instead to stop future commissions.
            </p>
          ) : (
            <>
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="w-full text-sm font-syne font-semibold px-4 py-3 rounded-xl transition-all bg-transparent text-red-400/70 hover:text-red-400 hover:bg-red-500/5 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : confirmingDelete ? 'Tap again to permanently delete' : 'Delete Affiliate'}
              </button>
              {deleteError && <p className="text-xs text-red-400 text-center mt-1">{deleteError}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}