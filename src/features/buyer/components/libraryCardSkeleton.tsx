export default function LibraryCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5">

      <div className="flex gap-4 items-start">
        <div className="shrink-0 w-16 h-16 rounded-xl bg-elevated animate-pulse" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-4 w-3/4 rounded-lg bg-elevated animate-pulse" />
          <div className="h-3 w-1/2 rounded-lg bg-elevated animate-pulse" />
          <div className="h-5 w-16 rounded-lg bg-elevated animate-pulse mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-2.5 w-16 rounded bg-elevated animate-pulse" />
            <div className="h-4 w-24 rounded bg-elevated animate-pulse" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <div className="h-2.5 w-20 rounded bg-elevated animate-pulse" />
          <div className="h-2.5 w-10 rounded bg-elevated animate-pulse" />
        </div>
        <div className="h-1 w-full rounded-full bg-elevated animate-pulse" />
      </div>

      <div className="h-px w-full bg-border" />

      <div className="h-10 w-full rounded-xl bg-elevated animate-pulse" />
    </div>
  );
}