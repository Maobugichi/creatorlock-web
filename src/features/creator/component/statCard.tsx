'use client';

import { useState } from 'react';
import { formatStat } from '../utils/overview.utils';

interface StatCardProps {
  label: string;
  value?: string;
  rawValue?: number;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, rawValue, sub, accent }: StatCardProps) {
  const [revealed, setRevealed] = useState(false);

  const formatted = rawValue !== undefined ? formatStat(rawValue) : null;
  const displayValue = formatted?.display ?? value ?? '—';
  const tooltipValue = formatted?.full;
  const isAbbreviated = formatted !== null;

  return (
    <div
      className={`bg-[#111] border rounded-2xl p-5 ${
        accent ? 'border-brand/30' : 'border-white/[0.07]'
      }`}
    >
      <p className="text-xs text-white/40 font-inter mb-2">{label}</p>

      <p
        onClick={() => isAbbreviated && setRevealed((v) => !v)}
        className={`font-mono text-2xl font-bold truncate transition-colors ${
          accent ? 'text-brand' : 'text-white'
        } ${
          isAbbreviated
            ? 'cursor-pointer underline decoration-dotted underline-offset-4 decoration-white/20'
            : ''
        }`}
      >
        {revealed && tooltipValue ? tooltipValue : displayValue}
      </p>

      {sub && <p className="text-xs text-white/30 font-inter mt-1">{sub}</p>}
    </div>
  );
}