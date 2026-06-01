"use client";

import { QueryClient , QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry:1,
            staleTime:1000 * 60 * 5
        }
    }
});

const AuthRehydrator = ({ children }: { children: React.ReactNode }) => {
  const rehydrate = useAuthStore((s) => s.rehydrate);
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading);
  const hasRun = useRef(false);

  useEffect(() => {
    console.log(user)
    if (!hasRun.current) {
      hasRun.current = true;
      rehydrate();
    }
  }, [rehydrate,user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

const Providers = ({children}:{children:React.ReactNode}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthRehydrator>{children}</AuthRehydrator>
        </QueryClientProvider>
    )
}

export default Providers