export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-white/[0.03]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/[0.03] rounded-xl w-3/4" />
        <div className="h-3 bg-white/[0.03] rounded-xl w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-white/[0.03] rounded-lg w-20" />
          <div className="h-7 bg-white/[0.03] rounded-xl w-7" />
        </div>
      </div>
    </div>
  );
}