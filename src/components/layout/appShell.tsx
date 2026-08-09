// components/layout/appShell.tsx
"use client";

import { useState, useSyncExternalStore } from "react";
import Sidebar, {
  creatorNavSections,
  buyerNavSections,
  withAffiliateNavItem,
  type NavSection,
} from "./sidebar";
import Topbar from "./topbar";
import { useAuthStore } from "@/store/auth.store";
import { useAffiliateStats } from "@/features/affiliates/api/useAffiliateStats";

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface AppShellProps {
  children: React.ReactNode;
  /**
   * "creator" — nav is always creatorNavSections, resolved immediately
   * (used by routes only ever reachable by creators, e.g. /dashboard, /products).
   *
   * "auto" — nav depends on the logged-in user's role, so it waits for
   * mount + a resolved role before rendering the sidebar at all, to avoid
   * a hydration-mismatch flash (used by routes shared with buyers, e.g.
   * /discover, /library, /profile).
   */
  navMode?: "creator" | "auto";
}

export default function AppShell({ children, navMode = "auto" }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);

  const roleKnown = navMode === "creator" || (mounted && !!user?.role);
  const { data: affiliateStats } = useAffiliateStats(roleKnown);

  if (navMode === "auto" && (!mounted || !user?.role)) {
    return <>{children}</>;
  }

  const baseNavSections: NavSection[] =
    navMode === "creator"
      ? creatorNavSections
      : user!.role === "creator"
        ? creatorNavSections
        : buyerNavSections;

  const navSections = withAffiliateNavItem(
    baseNavSections,
    (affiliateStats?.affiliates?.length ?? 0) > 0
  );

  return (
    <div className="flex h-dvh bg-background overflow-hidden font-inter">
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