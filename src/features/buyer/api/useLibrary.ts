import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { GetBuyerLibraryResponse, LibraryItem } from '@/types/library.types';

const fetchLibrary = async (): Promise<LibraryItem[]> => {
  const res = await api.get<GetBuyerLibraryResponse>('/buyer/library');
  return res.data.data;
};

export function useLibrary() {
  return useQuery<LibraryItem[], Error>({
    queryKey: ['buyer', 'library'],
    queryFn: fetchLibrary,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}