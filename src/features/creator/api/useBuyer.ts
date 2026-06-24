import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { extractBuyers } from '../utils/buyer.utils';

export const BUYERS_KEY = ['buyers'] as const;

export function useBuyers() {
  const query = useQuery({
    queryKey: BUYERS_KEY,
    queryFn: async () => {
      const res = await api.get('/creator/buyers');
     
      return res.data;
    },
  });
  const buyers = extractBuyers(query.data);

  return {
    ...query,
    buyers,
  };
}