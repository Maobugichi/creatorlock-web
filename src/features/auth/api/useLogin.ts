import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError, LoginInput, LoginResponse } from "../types/auth.types";

function getDefaultRoute(role: string) {
  if (role === "creator") return "/dashboard";
  if (role === "admin") return "/admin-payouts";
  return "/discover";
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: LoginInput) =>
      api.post<LoginResponse>("/auth/login", data).then((r) => r.data),
    onSuccess: (data) => {
      setUser(data.user);
      const next = searchParams.get("next");
      router.push(next ?? getDefaultRoute(data.user.role));
    },
  });

  const errorMessage = isError
    ? ((error as ApiError)?.response?.data?.message ??
      "Invalid email or password. Please try again.")
    : null;

  return { mutate, isPending, errorMessage };
}