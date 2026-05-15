import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { extractBuyers } from '../_lib/formatter';

export const BUYERS_KEY = ['buyers'] as const;

export function useBuyers() {
  const query = useQuery({
    queryKey: BUYERS_KEY,
    queryFn: () => api.get('/creator/buyers').then((res) => res.data),
  });

  return {
    ...query,
    buyers: extractBuyers(query.data),
  };
}