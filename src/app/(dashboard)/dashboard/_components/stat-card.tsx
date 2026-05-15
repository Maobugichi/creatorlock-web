interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={`bg-[#111] border rounded-2xl p-5 ${
        accent ? "border-brand/30" : "border-white/[0.07]"
      }`}
    >
      <p className="text-xs text-white/40 font-inter mb-2">{label}</p>
      <p className={`font-mono text-2xl font-bold ${accent ? "text-brand" : "text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-white/30 font-inter mt-1">{sub}</p>}
    </div>
  );
}