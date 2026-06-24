import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardData, Period } from '../types/overview.types';

export function useDashboard(period: Period) {
  return useQuery({
    queryKey: ['dashboard', period],
    queryFn: () =>
      api
        .get<{ data: DashboardData }>(`/creator/dashboard?period=${period}`)
        .then((r) => r.data.data),
  });
}