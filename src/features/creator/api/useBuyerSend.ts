import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { BuyerEmailTemplate } from "../types/buyer.types";



export interface SendBuyerEmailInput {
  buyerIds: string[];
  template: BuyerEmailTemplate;
  subject: string;
  body: string;
  couponCode?: string;
  productTitle?: string;
  productUrl?: string;
}

interface SendBuyerEmailResponse {
  success: boolean;
  message: string;
  queued: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSendBuyerEmail() {
  const mutation = useMutation<
    SendBuyerEmailResponse,
    Error,
    SendBuyerEmailInput
  >({
    mutationFn: async (payload: SendBuyerEmailInput) => {
      const res = await api.post<SendBuyerEmailResponse>(
        "/creator/buyers/email",
        payload
      );
      return res.data;
    },
  });

  return {
    sendEmail: mutation.mutate,
    sendEmailAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}