interface DashboardCardProps {
  accent?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({ accent, className = '', children }: DashboardCardProps) {
  return (
    <div
      className={`bg-surface border rounded-2xl p-5 ${
        accent ? 'border-primary/30' : 'border-border'
      } ${className}`}
    >
      {children}
    </div>
  );
}