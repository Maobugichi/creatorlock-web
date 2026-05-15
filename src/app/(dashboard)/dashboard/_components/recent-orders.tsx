// recent-orders.tsx
import { DashboardData } from "../_hooks/useDashboard";
import { formatNGN, formatDate } from "@/lib/utils";

interface RecentOrdersProps {
  orders: DashboardData["recent_orders"];
  isLoading: boolean;
}

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
      <h2 className="font-syne font-bold text-white text-base mb-4">Recent orders</h2>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !orders.length ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-white/20 font-inter">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm text-white font-inter truncate">{order.buyer_name}</p>
                <p className="text-xs text-white/30 font-inter truncate">{order.product_title}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-bold text-white font-mono">{formatNGN(order.amount_cents)}</p>
                <p className="text-xs text-white/30 font-inter">{formatDate(order.ordered_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}