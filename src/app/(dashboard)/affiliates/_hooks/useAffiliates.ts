import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from '@/lib/api';
import type { Affiliate } from '../_types';

export function useAffiliates() {
  return useQuery<Affiliate[]>({
    queryKey: ['affiliates'],
    queryFn: async () => {
      try {
        const res = await api.get('/affiliates');
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        return [];
      } catch (err) {
        if (isAxiosError(err)) {
          console.error('[useAffiliates] status :', err.response?.status);
          console.error('[useAffiliates] message:', err.response?.data?.message ?? err.response?.data ?? err.message);
          console.error('[useAffiliates] full response data:', err.response?.data);
        } else {
          console.error('[useAffiliates] unexpected error:', err);
        }
        throw err;
      }
    },
  });
}