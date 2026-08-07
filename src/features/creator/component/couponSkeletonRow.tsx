export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border last:border-0 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-elevated rounded w-28" />
        <div className="h-3 bg-elevated rounded w-40" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 bg-elevated rounded-full w-16" />
        <div className="h-8 bg-elevated rounded-xl w-20" />
        <div className="h-8 bg-elevated rounded-xl w-16" />
      </div>
    </div>
  );
}