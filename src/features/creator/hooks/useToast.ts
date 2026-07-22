"use client";

import { useToastStore } from "@/store/toast.store";

export function useToast() {
  const toasts = useToastStore((s) => s.toasts);
  const show = useToastStore((s) => s.show);
  const dismiss = useToastStore((s) => s.dismiss);
  return { toasts, dismiss, show };
}