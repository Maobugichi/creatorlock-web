export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-elevated" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-elevated rounded-xl w-3/4" />
        <div className="h-3 bg-elevated rounded-xl w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-elevated rounded-lg w-20" />
          <div className="h-7 bg-elevated rounded-xl w-7" />
        </div>
      </div>
    </div>
  );
}