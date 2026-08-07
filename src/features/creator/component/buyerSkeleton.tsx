export function SummaryCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
      <div className="h-3.5 w-28 bg-elevated rounded-xl animate-pulse" />
      <div className="h-8 w-20 bg-elevated rounded-xl animate-pulse" />
    </div>
  );
}

export function BuyerRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0">
      <div className="w-3.5 h-3.5 rounded bg-elevated animate-pulse shrink-0 mr-4" />
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-elevated animate-pulse shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-3.5 w-36 bg-elevated rounded-xl animate-pulse" />
          <div className="h-3 w-52 bg-elevated rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 shrink-0 ml-4">
        <div className="h-3.5 w-8 bg-elevated rounded-xl animate-pulse" />
        <div className="h-3.5 w-24 bg-elevated rounded-xl animate-pulse" />
        <div className="h-3.5 w-20 bg-elevated rounded-xl animate-pulse" />
      </div>
    </div>
  );
}