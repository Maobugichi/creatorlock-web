'use client';

export function ExportButton() {
  const handleExport = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    window.open(`${baseUrl}/creator/buyers/export`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.98] border border-[var(--border)] text-white font-syne font-semibold rounded-xl px-4 py-2.5 text-sm transition-all"
    >
      <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Export CSV
    </button>
  );
}