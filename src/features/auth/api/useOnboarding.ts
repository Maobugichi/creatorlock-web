import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { OnboardingInput } from "../types/auth.types";

export function useOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: OnboardingInput) =>
      api.post("/auth/onboarding", data).then((r) => r.data),
    onSuccess: (data) => {
      setUser(data.user);
      const next = searchParams.get("next");
      if (next) { router.push(next); return; }
      router.push(data.user.role === "creator" ? "/dashboard" : "/discover");
    },
  });
}