"use client";

import { useState, useCallback } from "react";
import type { ToastItem, ToastVariant } from "../types/product.types";

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = "info", description?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, description, variant }]);
    },
    []
  );

  return { toasts, dismiss, show };
}