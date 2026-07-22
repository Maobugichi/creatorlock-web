import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useToggleAffiliate(affiliateId: string) {
  const queryClient = useQueryClient();

  const { mutate: toggle, isPending: isToggling } = useMutation({
    mutationFn: () =>
      api.patch(`/affiliates/${affiliateId}/toggle`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
  });

  return { toggle, isToggling };
}