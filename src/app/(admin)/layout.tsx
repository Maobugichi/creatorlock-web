"use client";

import { useState, useSyncExternalStore, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { adminNavSections } from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { useAuthStore } from "@/store/auth.store";

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (mounted && user && user.role !== "admin") {
      router.replace("/discover");
    }
  }, [mounted, user, router]);

  // Not mounted, no session, or not an admin — render nothing while the
  // redirect above (or the login flow) takes over. Avoids ever flashing
  // admin content to a non-admin user.
  if (!mounted || !user || user.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-[#0C0C0C] overflow-hidden font-inter">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        navSections={adminNavSections}
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