export function SummaryCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-5 space-y-3">
      <div className="h-3.5 w-28 bg-white/[0.03] rounded-xl animate-pulse" />
      <div className="h-8 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
    </div>
  );
}

export function BuyerRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/[0.03] animate-pulse shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-3.5 w-36 bg-white/[0.03] rounded-xl animate-pulse" />
          <div className="h-3 w-52 bg-white/[0.03] rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="h-3.5 w-8 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3.5 w-24 bg-white/[0.03] rounded-xl animate-pulse" />
        <div className="h-3.5 w-20 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}