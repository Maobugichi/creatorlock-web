import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { ApiError, ResetPasswordInput } from "../types/auth.types";

export function useResetPassword() {
  const router = useRouter();

  const { mutate: resetPassword, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      api.post("/auth/reset-password", data).then((r) => r.data),
    onSuccess: () => {
      setTimeout(() => router.push("/login"), 2000);
    },
  });

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ??
      "Invalid or expired reset link. Please request a new one."
    : null;

  return { resetPassword, isPending, isError, isSuccess, errorMessage };
}