 "use client";
 
import { ToastContainer } from "@/features/creator/component/toast";
import { useToastStore } from "@/store/toast.store";


export function GlobalToasts() {
 
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
}