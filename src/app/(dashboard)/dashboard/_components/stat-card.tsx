


"use client";

import { useState } from "react";


export function formatStat(value: number): { display: string; full: string } {
  const full = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(value);

  let display: string;

  if (value >= 1_000_000_000) {
    display = `₦${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  } else if (value >= 1_000_000) {
    display = `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  } else if (value >= 1_000) {
    display = `₦${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  } else {
    display = `₦${value.toLocaleString("en-NG")}`;
  }

  return { display, full };
}


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
  const displayValue = formatted?.display ?? value ?? "—";
  const tooltipValue = formatted?.full;
  const isAbbreviated = formatted !== null;

  return (
    <div
      className={`bg-[#111] border rounded-2xl p-5 ${
        accent ? "border-brand/30" : "border-white/[0.07]"
      }`}
    >
      <p className="text-xs text-white/40 font-inter mb-2">{label}</p>

      <p
        onClick={() => isAbbreviated && setRevealed((v) => !v)}
        className={`font-mono text-2xl font-bold truncate transition-colors ${
          accent ? "text-brand" : "text-white"
        } ${
          isAbbreviated
            ? "cursor-pointer underline decoration-dotted underline-offset-4 decoration-white/20"
            : ""
        }`}
      >
        {revealed && tooltipValue ? tooltipValue : displayValue}
      </p>

      {sub && <p className="text-xs text-white/30 font-inter mt-1">{sub}</p>}
    </div>
  );
}