import type { Payout } from '../types/payout.types';

export const MINIMUM_PAYOUT_CENTS = 500_000; // ₦5,000 — mirrors backend constant

export const STATUS_STYLES: Record<Payout['status'], { label: string; classes: string }> = {
  pending:    { label: 'Pending',    classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  approved:   { label: 'Approved',   classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  processing: { label: 'Processing', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  paid:       { label: 'Paid',       classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  failed:     { label: 'Failed',     classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  reversed:   { label: 'Reversed',   classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
};