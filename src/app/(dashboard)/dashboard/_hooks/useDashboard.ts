"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type Period = "7d" | "30d" | "90d";
export const PERIODS = ["7d", "30d", "90d"] as const satisfies Period[];

export interface DashboardData {
  summary: {
    total_revenue_cents: number;
    total_orders: number;
    total_products: number;
    pending_payout_cents: number;
  };
  top_products: {
    product_id: string;
    title: string;
    thumbnail: string | null;
    total_sales: number;
    total_revenue_cents: number;
  }[];
  recent_orders: {
    order_id: string;
    product_title: string;
    buyer_name: string;
    buyer_email: string;
    amount_cents: number;
    ordered_at: string;
  }[];
  revenue_chart: {
    date: string;
    revenue_cents: number;
    orders: number;
  }[];
}

export function useDashboard(period: Period) {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: () =>
      api
        .get<{ data: DashboardData }>(`/creator/dashboard?period=${period}`)
        .then((r) => r.data.data),
  });
}