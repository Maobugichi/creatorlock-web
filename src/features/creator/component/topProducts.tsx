import { DashboardCard } from "@/features/shared/component/dashboardCard";
import type { DashboardData } from '../types/overview.types';
import { formatNGN } from '@/lib/utils';

interface TopProductsProps {
  products: DashboardData['top_products'];
  isLoading: boolean;
}

export function TopProducts({ products, isLoading }: TopProductsProps) {
  return (
    <DashboardCard>
      <h2 className="font-syne font-bold text-surface-foreground text-base mb-4">Top products</h2>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-elevated rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !products.length ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-inter">No products yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {products.map((product, i) => (
            <div
              key={product.product_id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-elevated transition-colors"
            >
              <span className="text-xs font-mono text-muted-foreground w-4 flex-shrink-0">{i + 1}</span>
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.thumbnail ? (
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-xs font-bold font-syne">{product.title.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-foreground font-inter truncate">{product.title}</p>
                <p className="text-xs text-muted-foreground font-inter">
                  {product.total_sales} sale{product.total_sales !== 1 ? 's' : ''}
                </p>
              </div>
              <p className="text-sm font-bold text-surface-foreground font-mono flex-shrink-0">
                {formatNGN(product.total_revenue_cents)}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}