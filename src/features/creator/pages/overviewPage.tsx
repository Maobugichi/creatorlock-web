'use client';

import { useState } from 'react';
import { useDashboard } from '../api/useDashboard';
import { formatDate } from '@/lib/utils';
import type { Period } from '../types/overview.types';
import { StatCard } from '../component/statCard';
import { RevenueChart } from '../component/revenueChart';
import { RecentOrders } from '../component/recentOrders';
import { TopProducts } from '../component/topProducts';

export default function OverviewPage() {
  const [period, setPeriod] = useState<Period>('30d');
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
          rawValue={isLoading ? undefined : (data?.summary.total_revenue_cents ?? 0) / 100}
          value={isLoading ? '—' : undefined}
          sub="All time"
          accent
        />
        <StatCard
          label="Total orders"
          value={isLoading ? '—' : String(data?.summary.total_orders ?? 0)}
          sub="All time"
        />
        <StatCard
          label="Products"
          value={isLoading ? '—' : String(data?.summary.total_products ?? 0)}
          sub="Active + drafts"
        />
        <StatCard
          label="Pending payout"
          rawValue={isLoading ? undefined : (data?.summary.pending_payout_cents ?? 0) / 100}
          value={isLoading ? '—' : undefined}
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