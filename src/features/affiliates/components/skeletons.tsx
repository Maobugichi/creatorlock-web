export function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0, 2].map((i) => (
        <div key={i} className="bg-surface border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <div className="h-3.5 w-28 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-7 w-40 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function AffiliateRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/[0.03] animate-pulse shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-3.5 w-32 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-3 w-48 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="h-3.5 w-10 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3.5 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-6 w-16 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-7 w-16 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}