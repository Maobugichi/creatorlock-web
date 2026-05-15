"use client";

import { useState } from "react";
import { useDashboard, PERIODS, Period } from "../_hooks/useDashboard";
import { formatNGN, formatDate } from "@/lib/utils"
import { StatCard } from "./stat-card";
import { RevenueChart } from "./revenue-chart";
import { RecentOrders } from "./recent-orders";
import { TopProducts } from "./top-product";

export function DashboardClient() {
  const [period, setPeriod] = useState<Period>("30d");
  const { data, isLoading } = useDashboard(period);

  const chartData =
    data?.revenue_chart.map((d) => ({
      date: formatDate(d.date),
      revenue: d.revenue_cents / 100,
      orders: d.orders,
    })) ?? [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total revenue"
          value={isLoading ? "—" : formatNGN(data?.summary.total_revenue_cents ?? 0)}
          sub="All time"
          accent
        />
        <StatCard
          label="Total orders"
          value={isLoading ? "—" : String(data?.summary.total_orders ?? 0)}
          sub="All time"
        />
        <StatCard
          label="Products"
          value={isLoading ? "—" : String(data?.summary.total_products ?? 0)}
          sub="Active + drafts"
        />
        <StatCard
          label="Pending payout"
          value={isLoading ? "—" : formatNGN(data?.summary.pending_payout_cents ?? 0)}
          sub="Awaiting withdrawal"
        />
      </div>

      <RevenueChart
        data={chartData}
        isLoading={isLoading}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentOrders orders={data?.recent_orders ?? []} isLoading={isLoading} />
        <TopProducts products={data?.top_products ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}