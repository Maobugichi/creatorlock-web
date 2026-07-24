'use client';

import { formatNGN } from '@/lib/utils';
import { STATUS_STYLES } from '@/features/shared/utils/payout.utils';
import type { PayoutStatus } from '@/features/shared/types/payout-status.types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface PayoutQueueRowProps {
  recipientName: string;
  recipientSub: string;
  amountCents: number;
  status: PayoutStatus;
  requestedAt: string;
  failureReason: string | null;
  canApprove: boolean;
  canProcess: boolean;
  onApprove: () => void;
  onProcess: () => void;
  isApproving: boolean;
  isProcessing: boolean;
  actionError: string | null;
}

export function PayoutQueueRow({
  recipientName,
  recipientSub,
  amountCents,
  status,
  requestedAt,
  failureReason,
  canApprove,
  canProcess,
  onApprove,
  onProcess,
  isApproving,
  isProcessing,
  actionError,
}: PayoutQueueRowProps) {
  const style = STATUS_STYLES[status];

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <div className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.015] transition-colors">
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium truncate">{recipientName}</p>
          <p className="text-[var(--muted)] text-xs truncate">{recipientSub}</p>
        </div>

        <div className="flex items-center gap-6 shrink-0 ml-4">
          <div className="hidden sm:block text-right w-28">
            <p className="text-white text-sm font-mono">{formatNGN(amountCents)}</p>
            <p className="text-[var(--muted)] text-xs">{formatDate(requestedAt)}</p>
          </div>

          <span className={`text-xs font-syne font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${style.classes}`}>
            {style.label}
          </span>

          <div className="flex items-center gap-2 shrink-0 w-40 justify-end">
            {canApprove && (
              <button
                onClick={onApprove}
                disabled={isApproving}
                className="text-xs font-syne font-semibold px-3 py-1.5 rounded-lg bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-colors disabled:opacity-50"
              >
                {isApproving ? '…' : 'Approve'}
              </button>
            )}
            {canProcess && (
              <button
                onClick={onProcess}
                disabled={isProcessing}
                className="text-xs font-syne font-semibold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
              >
                {isProcessing ? '…' : 'Process'}
              </button>
            )}
          </div>
        </div>
      </div>

      {(actionError || failureReason) && (
        <div className="px-5 pb-3 -mt-1">
          <p className="text-xs text-red-400">{actionError ?? failureReason}</p>
        </div>
      )}
    </div>
  );
}

export function PayoutQueueRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
      <div className="space-y-2 flex-1">
        <div className="h-3.5 w-32 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3 w-48 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
      <div className="flex items-center gap-6">
        <div className="h-3.5 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-6 w-16 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-7 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}