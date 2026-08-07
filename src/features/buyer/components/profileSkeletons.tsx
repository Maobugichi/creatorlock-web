export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-elevated rounded-lg w-1/3" />
      <div className="h-3 bg-elevated rounded-lg w-1/4" />
    </div>
  );
}

export function FieldSkeleton() {
  return (
    <div className="space-y-1.5 animate-pulse">
      <div className="h-3 bg-elevated rounded w-16" />
      <div className="h-10 bg-elevated rounded-xl" />
    </div>
  );
}