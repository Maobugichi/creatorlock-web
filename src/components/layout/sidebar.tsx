"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { X } from "@phosphor-icons/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

// ─── Nav items ────────────────────────────────────────────────────────────────

export const creatorNavSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
      {
        label: "Products",
        href: "/products",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Payouts",
        href: "/payouts",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Affiliates",
        href: "/affiliates",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Coupons",
        href: "/coupons",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
          </svg>
        ),
      },
      {
        label: "Buyers",
        href: "/buyers",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
          </svg>
        ),
      },
      {
        label: "Settings",
        href: "/settings",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Marketplace",
    items: [
      {
        label: "Discover",
        href: "/discover",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Library",
        href: "/library",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
];

export const buyerNavSections: NavSection[] = [
  {
    items: [
      {
        label: "Discover",
        href: "/discover",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Library",
        href: "/library",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: "Settings",
        href: "/profile",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
    ],
  },
];

// ─── Add near the other nav item definitions in sidebar.tsx ────────────────

export const affiliateDashboardNavItem: NavItem = {
  label: "Affiliate Earnings",
  href: "/affiliate/dashboard",
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Returns a new NavSection[] with the affiliate item appended to the first
// (unlabeled) section — never mutates the shared exported arrays, since
// those are module-level constants reused across every user's session.
export function withAffiliateNavItem(
  sections: NavSection[],
  hasAffiliateAccess: boolean
): NavSection[] {
  if (!hasAffiliateAccess) return sections;

  return sections.map((section, i) =>
    i === 0
      ? { ...section, items: [...section.items, affiliateDashboardNavItem] }
      : section
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
        isActive
          ? "text-white"
          : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav"
          className="absolute inset-0 bg-brand/10 border border-brand/20 rounded-xl"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex-shrink-0 transition-colors",
          isActive ? "text-brand" : "text-white/40 group-hover:text-white/60"
        )}
      >
        {item.icon}
      </span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 overflow-hidden whitespace-nowrap font-inter"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {collapsed && isActive && (
        <motion.div
          layoutId="active-dot"
          className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-brand"
        />
      )}
    </Link>
  );
}

// ─── Shared nav content ───────────────────────────────────────────────────────

function NavContent({
  navSections,
  collapsed,
  onNavigate,
}: {
  navSections: NavSection[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <nav className="flex-1 scrollbar-hide px-2 py-4 overflow-y-auto overflow-x-hidden">
        {navSections.map((section, i) => (
          <div
            key={section.label ?? `section-${i}`}
            className={i > 0 ? "mt-4 pt-4 border-t border-white/[0.06]" : ""}
          >
            {section.label && !collapsed && (
              <p className="px-3 pb-2 text-[10px] font-inter font-semibold uppercase tracking-widest text-white/25">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-white/[0.06]">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0">
            <span className="text-brand text-xs font-bold font-syne">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-xs font-medium text-white truncate font-inter">
                  {user?.name ?? "User"}
                </p>
                <p className="text-[10px] text-white/30 truncate font-inter">
                  {user?.email ?? ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={logout}
                className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0"
                title="Sign out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({
  collapsed,
  onToggle,
  navSections,
  mobileOpen = false,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  navSections: NavSection[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="hidden md:flex flex-col h-screen bg-[#0E0E0E] border-r border-white/[0.06] flex-shrink-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3  border-b border-white/[0.06]">
          <AnimatePresence>
            {!collapsed && (
             <div className="relative h-8 w-32 ">
              <Image
                src="/desktoplogo.png"
                alt="CreatorLock logo"
                fill
                className="object-contain"
              />
            </div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors flex-shrink-0"
          >
            <motion.svg
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
            >
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </button>
        </div>
        <NavContent navSections={navSections} collapsed={collapsed} />
      </motion.aside>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0E0E0E] border-r border-white/[0.06] md:hidden"
            >
              <div className="flex items-center justify-between px-4 py- border-b border-white/[0.06]">
                <Image
                  src="/tisolock.png"
                  alt="CreatorLock logo"
                  width={55}
                  height={55}
                />
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <NavContent
                navSections={navSections}
                collapsed={false}
                onNavigate={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}