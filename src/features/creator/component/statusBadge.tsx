export function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium font-mono bg-status-positive/10 text-status-positive border border-status-positive/20">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium font-mono bg-elevated text-muted-foreground border border-border">
      Inactive
    </span>
  );
}