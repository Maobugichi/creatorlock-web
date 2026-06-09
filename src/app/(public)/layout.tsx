"use client";

import { useState, useSyncExternalStore } from "react";
import Sidebar, { buyerNavItems } from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { useAuthStore } from "@/store/auth.store";

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);
  const isBuyer = user?.role === "buyer";

  if (!mounted || !isBuyer) return <>{children}</>;

  return (
    <div className="flex h-screen bg-[#0C0C0C] overflow-hidden font-inter">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        navItems={buyerNavItems}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}