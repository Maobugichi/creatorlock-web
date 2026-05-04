type StatsCardProps = {
  label: string;
  value: string;
  sub?: string;
};

export default function StatsCard({ label, value, sub }: StatsCardProps) {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-5">
      <p className="text-[12px] text-[var(--muted)] uppercase tracking-widest mb-2 font-mono">
        {label}
      </p>
      <p className="font-syne font-bold text-2xl text-white">{value}</p>
      {sub && <p className="text-[12px] text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  );
}