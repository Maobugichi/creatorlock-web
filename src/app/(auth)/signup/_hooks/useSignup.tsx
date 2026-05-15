import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError, SignupInput, SignupResponse } from "../types";

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: SignupInput) =>
      api.post<SignupResponse>("/auth/signup", data).then((r) => r.data),
    onSuccess: (data) => {
      setUser(data.user, data.accessToken);
      router.push(data.user.role === "creator" ? "/dashboard" : "/library");
    },
  });

  const errorMessage = isError
    ? ((error as ApiError)?.response?.data?.message ??
      "Something went wrong. Please try again.")
    : null;

  return { mutate, isPending, errorMessage };
}