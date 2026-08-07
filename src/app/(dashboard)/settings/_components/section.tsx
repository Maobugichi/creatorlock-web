interface SectionProps {
  title: string;
  sub: string;
  children: React.ReactNode;
}

export function Section({ title, sub, children }: SectionProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="mb-5 pb-4 border-b border-border">
        <h2 className="font-syne font-bold text-surface-foreground text-base">{title}</h2>
        <p className="text-xs text-muted-foreground font-inter mt-0.5">{sub}</p>
      </div>
      {children}
    </div>
  );
}