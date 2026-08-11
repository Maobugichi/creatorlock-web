import Link from 'next/link';
import { DashboardCard } from "@/features/shared/component/dashboardCard";
import type { DashboardData } from '../types/overview.types';
import { formatNGN, formatDate } from '@/lib/utils';

interface RecentOrdersProps {
  orders: DashboardData['recent_orders'];
  isLoading: boolean;
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-bold text-surface-foreground text-base">Recent orders</h2>
        {!isLoading && orders.length > 0 && (
          <Link
            href="/buyers"
            className="text-xs font-medium text-muted-foreground hover:text-surface-foreground font-inter transition-colors"
          >
            View all
          </Link>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-elevated rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !orders.length ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-inter">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[360px] overflow-y-auto scrollbar-hide">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-elevated transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm text-surface-foreground font-inter truncate">{order.buyer_name}</p>
                <p className="text-xs text-muted-foreground font-inter truncate">{order.product_title}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-bold text-price font-mono">+{formatNGN(order.amount_cents)}</p>
                <p className="text-xs text-muted-foreground font-inter">{formatDate(order.ordered_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}