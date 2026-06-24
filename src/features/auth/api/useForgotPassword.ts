import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiError } from "../types/auth.types";

export function useForgotPassword() {
  return useMutation<void, ApiError, string>({
    mutationFn: (email) =>
      api.post("/auth/forgot-password", { email }).then((r) => r.data),
  });
}