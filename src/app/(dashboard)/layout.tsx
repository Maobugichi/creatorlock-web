"use client";

import { useState } from "react";
import Sidebar, { creatorNavSections, withAffiliateNavItem } from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { useAffiliateStats } from "@/features/affiliates/api/useAffiliateStats";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: affiliateStats } = useAffiliateStats();
  const navSections = withAffiliateNavItem(
    creatorNavSections,
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