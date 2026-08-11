// features/shared/component/statCard.tsx
'use client';

import { useState } from 'react';
import { DashboardCard } from './dashboardCard';

interface FormattedStat {
  display: string;
  full: string;
}

interface StatCardProps {
  label: string;
  value?: string;
  rawValue?: number;
  sub?: string;
  accent?: boolean;
  /** Optional — abbreviates rawValue for display with a tap-to-reveal full value. */
  formatValue?: (raw: number) => FormattedStat;
}

export function StatCard({ label, value, rawValue, sub, accent, formatValue }: StatCardProps) {
  const [revealed, setRevealed] = useState(false);

  const formatted = rawValue !== undefined && formatValue ? formatValue(rawValue) : null;
  const displayValue = formatted?.display ?? value ?? (rawValue !== undefined ? rawValue.toLocaleString() : '—');
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