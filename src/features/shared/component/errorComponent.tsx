export function ErrorState({
  variant = 'full',
  title,
  message,
  action,
}: {
  variant?: 'full' | 'compact';
  title?: string;
  message: string;
  action: { label: string; onClick: () => void };
}) {
  if (variant === 'compact') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground font-inter text-sm">{message}</p>
        <button
          onClick={action.onClick}
          className="mt-4 text-primary hover:underline font-inter text-sm"
        >
          {action.label}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-6 text-status-exception opacity-20" aria-hidden="true">
        <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2" />
        <path d="M40 26v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="52" r="1.5" fill="currentColor" />
      </svg>
      {title && <h3 className="font-syne font-bold text-surface-foreground text-lg mb-2">{title}</h3>}
      <p className="font-inter text-muted-foreground text-sm mb-6 max-w-xs">{message}</p>
      <button
        onClick={action.onClick}
        className="bg-elevated hover:bg-elevated/70 active:scale-[0.98] text-surface-foreground font-syne font-semibold rounded-xl px-6 py-3 text-sm transition-all border border-border-strong"
      >
        {action.label}
      </button>
    </div>
  );
}