import { formatNGN } from '@/lib/utils';
import type { BuyerRow } from '../types/buyer.types';

export function SummaryCards({ buyers }: { buyers: BuyerRow[] }) {
  const totalSpent = buyers.reduce((sum, b) => sum + parseInt(b.total_spent_cents), 0);
  const totalOrders = buyers.reduce((sum, b) => sum + parseInt(b.total_purchases), 0);

  const stats = [
    { label: 'Total Buyers', value: buyers.length.toLocaleString() },
    { label: 'Total Orders', value: totalOrders.toLocaleString() },
    { label: 'Total Revenue', value: formatNGN(totalSpent) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-surface border border-[var(--border)] rounded-2xl p-5">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-2">{label}</p>
          <p className="text-white font-syne font-extrabold text-2xl font-mono">{value}</p>
        </div>
      ))}
    </div>
  );
}