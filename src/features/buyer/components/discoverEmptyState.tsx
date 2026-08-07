interface DiscoverEmptyStateProps {
  search: string;
}

export function DiscoverEmptyState({ search }: DiscoverEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-elevated border border-border flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="font-syne font-bold text-surface-foreground text-base mb-1">
        {search.length > 0 ? 'No products found' : 'No products yet'}
      </p>
      <p className="font-inter text-sm text-muted-foreground max-w-xs">
        {search.length > 0
          ? 'Try adjusting your search term.'
          : 'Check back soon — creators are publishing new products daily.'}
      </p>
    </div>
  );
}