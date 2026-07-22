import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { BuyerProfile, UpdateBuyerProfileFields, ApiError } from '@/features/buyer/types/buyer.types';

export function useBuyerProfile() {
  return useQuery<BuyerProfile>({
    queryKey: ['buyer', 'profile'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BuyerProfile }>('/buyer/profile');
      return res.data.data;
    },
  });
}

export function useUpdateBuyerProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (fields: UpdateBuyerProfileFields) => {
      const res = await api.patch<{ success: boolean; data: BuyerProfile }>(
        '/buyer/profile',
        fields
      );
      return res.data.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['buyer', 'profile'], updated);
    },
  });

  const errorMessage =
    (mutation.error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.';

  return { ...mutation, errorMessage };
}

interface UpgradeToCreatorFields {
  storeSlug: string;
}

interface UpgradeToCreatorResponse {
  user: { id: string; email: string; role: string; name: string };
}

export function useUpgradeToCreator() {
  const mutation = useMutation({
    mutationFn: async (fields: UpgradeToCreatorFields) => {
      const res = await api.post<UpgradeToCreatorResponse>(
        '/auth/upgrade-to-creator',
        fields
      );
      return res.data;
    },
  });

  const errorMessage =
    (mutation.error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.';

  return { ...mutation, errorMessage };
}