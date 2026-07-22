'use client';

import { useEffect, useRef, useState } from 'react';
import type { Affiliate } from '../types/affiliate.types';
import { useToggleAffiliate } from '../api/useToggleAffiliate';
import { useResendInvite } from '../api/useResendInvite';
import { useUpdateCommission } from '../api/useUpdateCommission';
import { useDeleteAffiliate } from '../api/useDeleteAffiliate';
import { StatusBadge } from '../../creator/component/statusBadge';
import { AffiliateActionSheet } from './affiliateActionSheet';
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

function initialsOf(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

interface AffiliateRowProps {
  affiliate: Affiliate;
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export function AffiliateRow({ affiliate, selectMode = false, selected = false, onToggleSelect }: AffiliateRowProps) {
  const { toggle, isToggling } = useToggleAffiliate(affiliate.id);
  const { resendInvite, isResending, resendError } = useResendInvite(affiliate.id);
  const { updateCommission, isUpdating } = useUpdateCommission();
  const { deleteAffiliate, isDeleting, deleteError } = useDeleteAffiliate(affiliate.id);

  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingCommission, setEditingCommission] = useState(false);
  const [commissionDraft, setCommissionDraft] = useState(String(affiliate.commission_percent));
  const [sheetOpen, setSheetOpen] = useState(false);

  const cooldownRemaining = useCooldownRemaining(affiliate.last_invite_sent_at);
  const onCooldown = cooldownRemaining > 0;

  const initials = initialsOf(affiliate.affiliate_name);
  const referralUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${affiliate.store_slug}?ref=${affiliate.code}`;

  async function handleCopyLink(e?: React.MouseEvent) {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(referralUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — fail silently
      // rather than surfacing an error for what's a low-stakes convenience action.
    }
  }

  function handleStartCommissionEdit() {
    setCommissionDraft(String(affiliate.commission_percent));
    setEditingCommission(true);
  }

  function handleCancelCommissionEdit() {
    setEditingCommission(false);
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
      toggle();
      setConfirmingDeactivate(false);
    } else {
      setConfirmingDeactivate(true);
    }
  }

  function handleDeleteClick() {
    if (confirmingDelete) {
      deleteAffiliate();
    } else {
      setConfirmingDelete(true);
    }
  }

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      {/* ── Desktop row ──────────────────────────────────────────────── */}
      <div
        onClick={selectMode ? onToggleSelect : undefined}
        className={`hidden sm:flex items-center justify-between px-5 py-4 transition-colors ${
          selectMode ? 'cursor-pointer hover:bg-white/[0.02]' : 'hover:bg-white/[0.015]'
        } ${selected ? 'bg-brand/[0.03]' : ''}`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {selectMode && (
            <div
              className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                selected ? 'bg-brand border-brand' : 'border-[var(--border)]'
              }`}
            >
              {selected && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          )}
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <span className="text-brand text-xs font-syne font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{affiliate.affiliate_name}</p>
            <p className="text-[var(--muted)] text-xs truncate">{affiliate.affiliate_email}</p>
            <p className="text-[var(--muted)] text-xs opacity-60">Joined {formatRelativeTime(affiliate.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 ml-4">
          <div className="w-20 text-right">
            <p className="text-white text-sm font-mono">{affiliate.total_conversions}</p>
            <p className="text-[var(--muted)] text-xs">conversions</p>
            {affiliate.conversions_this_week > 0 && (
              <p className="text-green-400 text-[10px] font-medium">+{affiliate.conversions_this_week} this wk</p>
            )}
          </div>

          <div className="w-24 text-right">
            {editingCommission ? (
              <div className="flex items-center justify-end gap-1">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={commissionDraft}
                  onChange={(e) => setCommissionDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCommission();
                    if (e.key === 'Escape') handleCancelCommissionEdit();
                  }}
                  autoFocus
                  className="w-14 bg-[var(--bg)] border border-brand/40 rounded-lg px-1.5 py-1 text-white text-sm font-mono text-right focus:outline-none focus:border-brand"
                />
                <button onClick={handleSaveCommission} disabled={isUpdating} aria-label="Save commission" className="text-green-400 hover:text-green-300 disabled:opacity-50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button onClick={handleCancelCommissionEdit} aria-label="Cancel" className="text-[var(--muted)] hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-1.5 group/commission">
                <p className="text-white text-sm font-mono">{affiliate.commission_percent}%</p>
                <button onClick={handleStartCommissionEdit} aria-label="Edit commission" className="text-[var(--muted)] opacity-0 group-hover/commission:opacity-100 hover:text-brand transition-opacity">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.5-9.5a2.121 2.121 0 0 1 3 3L12 16l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            )}
            <p className="text-[var(--muted)] text-xs">commission</p>
          </div>

          <div className="w-16 flex justify-end">
            <StatusBadge active={affiliate.active} />
          </div>

          {selectMode ? (
            <div className="w-64" />
          ) : (
          <div className="flex items-center gap-2 w-64 justify-end">
            <button
              onClick={handleCopyLink}
              title="Copy referral link"
              aria-label="Copy referral link"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20"
            >
              {linkCopied ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="11" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>

            <button
              onClick={() => resendInvite()}
              disabled={isResending || onCooldown}
              title={onCooldown ? `Available in ${formatCooldown(cooldownRemaining)}` : 'Resend invite email'}
              className="text-xs font-syne font-semibold px-3 py-1.5 rounded-lg transition-all bg-white/[0.04] text-[var(--muted)] border border-[var(--border)] hover:bg-white/[0.08] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {isResending ? '…' : onCooldown ? formatCooldown(cooldownRemaining) : 'Resend'}
            </button>

            <button
              onClick={handleDeactivateClick}
              onBlur={() => setConfirmingDeactivate(false)}
              disabled={isToggling}
              className={`text-xs font-syne font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                affiliate.active
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
              }`}
            >
              {isToggling ? '…' : confirmingDeactivate ? 'Confirm?' : affiliate.active ? 'Deactivate' : 'Activate'}
            </button>

            <div className="relative">
              <button
                onClick={handleDeleteClick}
                onBlur={() => setConfirmingDelete(false)}
                disabled={isDeleting || affiliate.total_conversions > 0}
                title={
                  affiliate.total_conversions > 0
                    ? "Can't delete — has conversion history. Deactivate instead."
                    : confirmingDelete
                    ? 'Click again to permanently delete'
                    : 'Delete affiliate'
                }
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                {isDeleting ? (
                  <span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {confirmingDelete ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-8.25 3h.008v.008h-.008v-.008z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    )}
                  </svg>
                )}
              </button>
            </div>
            {deleteError && (
              <div className="absolute top-full right-0 mt-1 z-10">
                <p className="text-xs text-red-400 bg-surface border border-red-500/20 rounded-lg px-2.5 py-1.5 whitespace-nowrap">{deleteError}</p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {resendError && (
        <div className="hidden sm:block px-5 pb-3 -mt-1">
          <p className="text-xs text-red-400">{resendError}</p>
        </div>
      )}

      {/* ── Mobile row (compact, tap to open full sheet or select) ──── */}
      <div
        onClick={selectMode ? onToggleSelect : () => setSheetOpen(true)}
        className={`sm:hidden flex items-center justify-between px-5 py-4 active:bg-white/[0.02] transition-colors cursor-pointer ${selected ? 'bg-brand/[0.03]' : ''}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <span className="text-brand text-xs font-syne font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{affiliate.affiliate_name}</p>
            <p className="text-[var(--muted)] text-xs truncate">{affiliate.affiliate_email}</p>
            <p className="text-[var(--muted)] text-xs opacity-60">Joined {formatRelativeTime(affiliate.created_at)}</p>
          </div>
        </div>

        {selectMode ? (
          <div
            className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
              selected ? 'bg-brand border-brand' : 'border-[var(--border)]'
            }`}
          >
            {selected && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ) : (
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={handleCopyLink}
            aria-label="Copy referral link"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all bg-brand/10 text-brand border border-brand/20"
          >
            {linkCopied ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="11" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        )}
      </div>

      {sheetOpen && (
        <AffiliateActionSheet affiliate={affiliate} onClose={() => setSheetOpen(false)} />
      )}
    </div>
  );
}