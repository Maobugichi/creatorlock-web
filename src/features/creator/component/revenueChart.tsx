'use client';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { PERIODS } from '../types/overview.types';
import type { Period } from '../types/overview.types';

interface ChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: ChartPoint[];
  isLoading: boolean;
  period: Period;
  onPeriodChange: (p: Period) => void;
}

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
        ₦{(payload[0]?.value ?? 0).toLocaleString('en-NG')}
      </p>
    </div>
  );
}

export function RevenueChart({ data, isLoading, period, onPeriodChange }: RevenueChartProps) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne font-bold text-white text-base">Revenue</h2>
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-inter transition-colors ${
                period === p ? 'bg-brand text-white' : 'text-white/40 hover:text-white/60'
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
      ) : data.length === 0 ? (
        <div className="h-52 flex items-center justify-center">
          <p className="text-sm text-white/20 font-inter">No revenue data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FB5C06" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#FB5C06" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'var(--font-inter)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'var(--font-inter)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FB5C06"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#FB5C06', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}