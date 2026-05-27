export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-2/5" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-white/10 rounded w-20" />
        <div className="h-6 bg-white/5 rounded-full w-16" />
        <div className="h-8 bg-white/5 rounded-xl w-24" />
      </div>
    </div>
  );
}