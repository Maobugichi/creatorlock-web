"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  summary: {
    total_revenue_cents: number;
    total_orders: number;
    total_products: number;
    pending_payout_cents: number;
  };
  top_products: {
    product_id: string;
    title: string;
    thumbnail: string | null;
    total_sales: number;
    total_revenue_cents: number;
  }[];
  recent_orders: {
    order_id: string;
    product_title: string;
    buyer_name: string;
    buyer_email: string;
    amount_cents: number;
    ordered_at: string;
  }[];
  revenue_chart: {
    date: string;
    revenue_cents: number;
    orders: number;
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNGN = (cents: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(cents / 100);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-[#111] border rounded-2xl p-5 ${
        accent ? "border-brand/30" : "border-white/[0.07]"
      }`}
    >
      <p className="text-xs text-white/40 font-inter mb-2">{label}</p>
      <p
        className={`font-mono text-2xl font-bold ${
          accent ? "text-brand" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-white/30 font-inter mt-1">{sub}</p>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3">
      <p className="text-xs text-white/40 font-inter mb-1">{label}</p>
      <p className="text-sm font-bold text-white font-mono">
        {formatNGN((payload[0]?.value ?? 0) * 100)}
      </p>
    </div>
  );
}

// ─── Period tabs ──────────────────────────────────────────────────────────────

const periods = ["7d", "30d", "90d"] as const;
type Period = (typeof periods)[number];

// ─── Dashboard page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30d");

  const { data, isLoading , error } = useQuery({
    queryKey: ["dashboard", period],
    queryFn: () =>
      api
        .get<{ data: DashboardData }>(`/creator/dashboard?period=${period}`)
        .then((r) => r.data.data),
  });
  

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
          value={
            isLoading ? "—" : formatNGN(data?.summary.total_revenue_cents ?? 0)
          }
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
          value={
            isLoading
              ? "—"
              : formatNGN(data?.summary.pending_payout_cents ?? 0)
          }
          sub="Awaiting withdrawal"
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-white text-base">Revenue</h2>

          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-inter transition-colors ${
                  period === p
                    ? "bg-brand text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-52 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center">
            <p className="text-sm text-white/20 font-inter">
              No revenue data yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FB5C06" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FB5C06" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="date"
                tick={{
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontFamily: "var(--font-inter)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontFamily: "var(--font-inter)",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FB5C06"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#FB5C06", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent orders */}
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="font-syne font-bold text-white text-base mb-4">
            Recent orders
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white/[0.03] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : !data?.recent_orders.length ? (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-white/20 font-inter">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {data.recent_orders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white font-inter truncate">
                      {order.buyer_name}
                    </p>
                    <p className="text-xs text-white/30 font-inter truncate">
                      {order.product_title}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-bold text-white font-mono">
                      {formatNGN(order.amount_cents)}
                    </p>
                    <p className="text-xs text-white/30 font-inter">
                      {formatDate(order.ordered_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="font-syne font-bold text-white text-base mb-4">
            Top products
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white/[0.03] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : !data?.top_products.length ? (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-white/20 font-inter">
                No products yet
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {data.top_products.map((product, i) => (
                <div
                  key={product.product_id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-xs font-mono text-white/20 w-4 flex-shrink-0">
                    {i + 1}
                  </span>

                  <div className="w-9 h-9 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-brand text-xs font-bold font-syne">
                        {product.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-inter truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-white/30 font-inter">
                      {product.total_sales} sale
                      {product.total_sales !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-white font-mono flex-shrink-0">
                    {formatNGN(product.total_revenue_cents)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}