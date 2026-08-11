import { formatNGN } from '@/lib/utils';
import type { BuyerRow } from '../types/buyer.types';
import { StatCard } from '@/features/shared/component/statCard';

export function SummaryCards({ buyers }: { buyers: BuyerRow[] }) {
  const totalSpent = buyers.reduce((sum, b) => sum + parseInt(b.total_spent_cents), 0);
  const totalOrders = buyers.reduce((sum, b) => sum + parseInt(b.total_purchases), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total Buyers" value={buyers.length.toLocaleString()} />
      <StatCard label="Total Orders" value={totalOrders.toLocaleString()} />
      <StatCard label="Total Revenue" value={formatNGN(totalSpent)} />
    </div>
  );
}