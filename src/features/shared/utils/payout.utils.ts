import type { PayoutStatus } from '../types/payout-status.types';

export const MINIMUM_PAYOUT_CENTS = 500_000;

export const STATUS_STYLES: Record<PayoutStatus, { label: string; classes: string }> = {
  pending:    { label: 'Pending',    classes: 'bg-status-neutral/10 text-status-neutral border-status-neutral/20' },
  approved:   { label: 'Approved',   classes: 'bg-status-neutral/10 text-status-neutral border-status-neutral/20' },
  processing: { label: 'Processing', classes: 'bg-status-progress/10 text-status-progress border-status-progress/20' },
  paid:       { label: 'Paid',       classes: 'bg-success/10 text-success border-success/20' },
  failed:     { label: 'Failed',     classes: 'bg-status-exception/10 text-status-exception border-status-exception/20' },
  reversed:   { label: 'Reversed',   classes: 'bg-status-warning/10 text-status-warning border-status-warning/20' },
};