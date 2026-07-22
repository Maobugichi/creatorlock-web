"use client";

import { useState, useSyncExternalStore } from "react";
import Sidebar, { creatorNavSections, buyerNavSections, withAffiliateNavItem } from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { useAuthStore } from "@/store/auth.store";
import { useAffiliateStats } from "@/features/affiliates/api/useAffiliateStats";

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

  // Hook must be called unconditionally (before any early return) per rules
  // of hooks — disabled via `enabled` until we know there's a real session,
  // so logged-out visitors browsing Discover never fire an authenticated request.
  const { data: affiliateStats } = useAffiliateStats(mounted && !!user?.role);

  // Not mounted yet, or no session at all — render bare content (e.g. logged-out visitor browsing Discover)
  if (!mounted || !user?.role) return <>{children}</>;

  const baseNavSections = user.role === "creator" ? creatorNavSections : buyerNavSections;
  const navSections = withAffiliateNavItem(
    baseNavSections,
    (affiliateStats?.affiliates?.length ?? 0) > 0
  );

  return (
    <div className="flex h-screen bg-[#0C0C0C] overflow-hidden font-inter">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        navSections={navSections}
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