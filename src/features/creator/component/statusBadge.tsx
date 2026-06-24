export function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium font-mono bg-green-500/10 text-green-400 border border-green-500/20">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium font-mono bg-white/5 text-[var(--muted)] border border-[var(--border)]">
      Inactive
    </span>
  );
}