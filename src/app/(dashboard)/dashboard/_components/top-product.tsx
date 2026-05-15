// top-products.tsx
import { DashboardData } from "../_hooks/useDashboard";
import { formatNGN } from "@/lib/utils";

interface TopProductsProps {
  products: DashboardData["top_products"];
  isLoading: boolean;
}

export function TopProducts({ products, isLoading }: TopProductsProps) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5">
      <h2 className="font-syne font-bold text-white text-base mb-4">Top products</h2>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !products.length ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-white/20 font-inter">No products yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {products.map((product, i) => (
            <div
              key={product.product_id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-xs font-mono text-white/20 w-4 flex-shrink-0">{i + 1}</span>
              <div className="w-9 h-9 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.thumbnail ? (
                  <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-brand text-xs font-bold font-syne">{product.title.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-inter truncate">{product.title}</p>
                <p className="text-xs text-white/30 font-inter">
                  {product.total_sales} sale{product.total_sales !== 1 ? "s" : ""}
                </p>
              </div>
              <p className="text-sm font-bold text-white font-mono flex-shrink-0">
                {formatNGN(product.total_revenue_cents)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}