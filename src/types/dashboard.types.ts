export interface SalesSummary {
  total_revenue_cents: number;
  total_orders: number;
  total_products: number;
  pending_payout_cents: number;
}

export interface TopProduct {
  product_id: string;
  title: string;
  thumbnail: string | null;
  total_sales: number;
  total_revenue_cents: number;
}

export interface RecentOrder {
  order_id: string;
  product_title: string;
  buyer_name: string;
  buyer_email: string;
  amount_cents: number;
  ordered_at: Date;
}

export interface RevenuePoint {
  date: string;
  revenue_cents: number;
  orders: number;
}

export interface DashboardData {
  summary: SalesSummary;
  top_products: TopProduct[];
  recent_orders: RecentOrder[];
  revenue_chart: RevenuePoint[];
}