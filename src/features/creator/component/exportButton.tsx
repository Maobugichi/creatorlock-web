'use client';

import { useExportBuyers } from '../api/useExportBuyer';

export function ExportButton() {
  const { exportBuyers } = useExportBuyers();

  return (
    <button
      onClick={exportBuyers}
      aria-label="Export CSV"
      className="flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.98] border border-[var(--border)] text-white font-syne font-semibold rounded-xl w-9 h-9 sm:w-auto sm:h-auto px-0 sm:px-4 py-0 sm:py-2.5 text-sm transition-all"
    >
      <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span className="hidden sm:inline">Export CSV</span>
    </button>
  );
}