'use client';

import { useState } from 'react';
import { DashboardCard } from "@/features/shared/component/dashboardCard";
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
    <DashboardCard accent={accent}>
      <p className="text-xs text-muted-foreground font-inter mb-2">{label}</p>

      <p
        onClick={() => isAbbreviated && setRevealed((v) => !v)}
        className={`font-mono text-2xl font-bold truncate transition-colors ${
          accent ? 'text-primary' : 'text-surface-foreground'
        } ${
          isAbbreviated
            ? 'cursor-pointer underline decoration-dotted underline-offset-4 decoration-border-strong'
            : ''
        }`}
      >
        {revealed && tooltipValue ? tooltipValue : displayValue}
      </p>

      {sub && <p className="text-xs text-muted-foreground font-inter mt-1">{sub}</p>}
    </DashboardCard>
  );
}