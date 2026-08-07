import type { Affiliate } from '../types/affiliate.types';
import { formatNGN } from '@/lib/utils';

export function SummaryCards({ affiliates }: { affiliates: Affiliate[] }) {
  const totalConversions = affiliates.reduce((sum, a) => sum + a.total_conversions, 0);
  const totalEarned = affiliates.reduce((sum, a) => sum + (a.total_earned_cents ?? 0), 0);
  const activeCount = affiliates.filter((a) => a.active).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-surface border border-border rounded-2xl p-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Total Conversions</p>
        <p className="text-surface-foreground font-syne font-extrabold text-2xl font-mono">
          {totalConversions.toLocaleString()}
        </p>
      </div>
      <div className="bg-surface border border-border rounded-2xl p-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Total Earned (Affiliates)</p>
        <p className="text-surface-foreground font-syne font-extrabold text-2xl font-mono">
          {formatNGN(totalEarned)}
        </p>
      </div>
      <div className="bg-surface border border-border rounded-2xl p-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Active Affiliates</p>
        <p className="text-surface-foreground font-syne font-extrabold text-2xl font-mono">
          {activeCount}
        </p>
      </div>
    </div>
  );
}