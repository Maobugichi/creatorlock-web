"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import api from "@/lib/api";

// ─── Page title map ───────────────────────────────────────────────────────────

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/payouts": "Payouts",
  "/affiliates": "Affiliates",
  "/coupons": "Coupons",
  "/subscribers": "Subscribers",
  "/settings": "Settings",
};

// ─── Notification bell ────────────────────────────────────────────────────────

function NotificationBell() {
  const { data } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () =>
      api.get<{ data: { count: number } }>("/notifications/unread-count")
        .then((r) => r.data.data.count),
    refetchInterval: 30_000,
  });

  const count = data ?? 0;

  return (
    <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand" />
      )}
    </button>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export default function Topbar({
  onMobileMenuOpen,
}: {
  onMobileMenuOpen: () => void;
}) {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname === path || pathname.startsWith(path + "/")
    )?.[1] ?? "CreatorLock";

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[#0C0C0C] flex-shrink-0">

      {/* Left — mobile menu + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <List size={22} weight="bold" />
        </button>

        

        {/* Desktop page title */}
        <h1 className="hidden md:block font-syne font-bold text-lg text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  );
}