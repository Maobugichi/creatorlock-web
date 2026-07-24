'use client';

export type PayoutStatusFilterValue = 'all' | 'pending' | 'approved' | 'processing' | 'paid' | 'failed' | 'reversed';

const OPTIONS: { value: PayoutStatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'reversed', label: 'Reversed' },
];

export function PayoutStatusFilter({
  value,
  onChange,
}: {
  value: PayoutStatusFilterValue;
  onChange: (v: PayoutStatusFilterValue) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide bg-white/[0.03] border border-[var(--border)] rounded-xl p-1 w-fit">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`text-xs font-syne font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            value === opt.value ? 'bg-brand/15 text-brand' : 'text-[var(--muted)] hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}