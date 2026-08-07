"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "@phosphor-icons/react";
import type { ToastItem, ToastVariant } from "../types/product.types";

const TOAST_ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const TOAST_STYLES: Record<ToastVariant, { icon: string; border: string }> = {
  success: { icon: "text-status-positive", border: "border-status-positive/20" },
  error:   { icon: "text-status-exception", border: "border-status-exception/20" },
  info:    { icon: "text-primary", border: "border-primary/20" },
};

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const Icon = TOAST_ICONS[toast.variant];
  const styles = TOAST_STYLES[toast.variant];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm bg-elevated border ${styles.border} rounded-2xl px-4 py-3.5 shadow-xl animate-in slide-in-from-right-4 fade-in duration-200`}
    >
      <Icon size={16} weight="fill" className={`${styles.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="font-syne font-semibold text-surface-foreground text-sm">{toast.message}</p>
        {toast.description && (
          <p className="font-inter text-muted-foreground text-xs mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-muted-foreground hover:text-surface-foreground transition-colors shrink-0"
      >
        <X size={13} weight="bold" />
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}