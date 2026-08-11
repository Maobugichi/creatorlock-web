import type { Affiliate } from '../types/affiliate.types';
import { formatNGN } from '@/lib/utils';
import { StatCard } from '@/features/shared/component/statCard';

export function SummaryCards({ affiliates }: { affiliates: Affiliate[] }) {
  const totalConversions = affiliates.reduce((sum, a) => sum + a.total_conversions, 0);
  const totalEarned = affiliates.reduce((sum, a) => sum + (a.total_earned_cents ?? 0), 0);
  const activeCount = affiliates.filter((a) => a.active).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Total Conversions" value={totalConversions.toLocaleString()} />
      <StatCard label="Total Earned (Affiliates)" value={formatNGN(totalEarned)} />
      <StatCard label="Active Affiliates" value={activeCount.toLocaleString()} />
    </div>
  );
}