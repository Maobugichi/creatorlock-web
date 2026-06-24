import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiError } from "@/features/auth/types/auth.types";

export function useResendVerification() {
  const mutation = useMutation<void, ApiError>({
    mutationFn: () => api.post("/auth/verify-email/send"),
  });

  const errorMessage = mutation.isError
    ? (mutation.error?.response?.data?.message ?? "Something went wrong. Try again.")
    : null;

  return { ...mutation, errorMessage };
}