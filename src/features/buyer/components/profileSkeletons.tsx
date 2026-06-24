export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-white/[0.06] rounded-lg w-1/3" />
      <div className="h-3 bg-white/[0.03] rounded-lg w-1/4" />
    </div>
  );
}

export function FieldSkeleton() {
  return (
    <div className="space-y-1.5 animate-pulse">
      <div className="h-3 bg-white/[0.06] rounded w-16" />
      <div className="h-10 bg-white/[0.03] rounded-xl" />
    </div>
  );
}