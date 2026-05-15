interface SectionProps {
  title: string;
  sub: string;
  children: React.ReactNode;
}

export function Section({ title, sub, children }: SectionProps) {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6">
      <div className="mb-5 pb-4 border-b border-[var(--border)]">
        <h2 className="font-syne font-bold text-white text-base">{title}</h2>
        <p className="text-xs text-[var(--muted)] font-inter mt-0.5">{sub}</p>
      </div>
      {children}
    </div>
  );
}