import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError, SignupInput, SignupResponse } from "@/features/auth/types/auth.types";

export function useSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const { mutate, isPending, isError, error } = useMutation<
    SignupResponse,
    ApiError,
    SignupInput
  >({
    mutationFn: (data) =>
      api.post("/auth/signup", data).then((r) => r.data),
    onSuccess: (data) => {
      setUser(data.user);
      const next = searchParams.get("next");
      const pendingUrl = next
        ? `/verify-email/pending?next=${encodeURIComponent(next)}`
        : "/verify-email/pending";
      router.push(pendingUrl);
    },
  });

  const errorMessage = isError
    ? ((error as ApiError)?.response?.data?.message ?? "Something went wrong. Please try again.")
    : null;

  return { mutate, isPending, errorMessage };
}