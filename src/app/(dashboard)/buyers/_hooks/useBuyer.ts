import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { extractBuyers } from '../_lib/formatter';

export const BUYERS_KEY = ['buyers'] as const;

export function useBuyers() {
  const query = useQuery({
    queryKey: BUYERS_KEY,
    queryFn: async () => {
      const res = await api.get('/creator/buyers');
      console.log('[useBuyers] status:', res.status);
      console.log('[useBuyers] raw response:', res.data);
      return res.data;
    },
  });

  console.log('[useBuyers] query state:', {
    status: query.status,
    fetchStatus: query.fetchStatus,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
  });

  const buyers = extractBuyers(query.data);
  console.log('[useBuyers] extracted buyers:', buyers);

  return {
    ...query,
    buyers,
  };
}