// _hooks/useSignup.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { ApiError } from "../types";
import { useAuthStore } from "@/store/auth.store";

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/auth/signup", data).then((r) => r.data),
    onSuccess: (data) => {
      console.log(data)
      setUser(data.user);
      router.push("/verify-email/pending");
    },
  });

  const errorMessage = isError
    ? ((error as ApiError)?.response?.data?.message ??
      "Something went wrong. Please try again.")
    : null;

  return { mutate, isPending, errorMessage };
}