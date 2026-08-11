"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  X,
  SquaresFour,
  Package,
  CreditCard,
  ShareNetwork,
  Ticket,
  Users,
  Gear,
  Compass,
  BookBookmark,
  TrendUp,
} from "@phosphor-icons/react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

const ICON_SIZE = 18;
const ICON_WEIGHT = "duotone" as const;

export const creatorNavSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <SquaresFour size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Products",
        href: "/products",
        icon: <Package size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Payouts",
        href: "/payouts",
        icon: <CreditCard size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Affiliates",
        href: "/affiliates",
        icon: <ShareNetwork size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Coupons",
        href: "/coupons",
        icon: <Ticket size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Buyers",
        href: "/buyers",
        icon: <Users size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <Gear size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
    ],
  },
  {
    label: "Marketplace",
    items: [
      {
        label: "Discover",
        href: "/discover",
        icon: <Compass size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Library",
        href: "/library",
        icon: <BookBookmark size={ICON_SIZE} weight={ICON_WEIGHT} />,
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
        icon: <Compass size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Library",
        href: "/library",
        icon: <BookBookmark size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
      {
        label: "Settings",
        href: "/profile",
        icon: <Gear size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
    ],
  },
];

export const affiliateDashboardNavItem: NavItem = {
  label: "Affiliate Earnings",
  href: "/affiliate/dashboard",
  icon: <TrendUp size={ICON_SIZE} weight={ICON_WEIGHT} />,
};

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
          ? "text-surface-foreground"
          : "text-muted-foreground hover:text-surface-foreground/80 hover:bg-border-strong/10"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav"
          className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex-shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-surface-foreground/70"
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
          className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-primary"
        />
      )}
    </Link>
  );
}

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
            className={i > 0 ? "mt-4 pt-4 border-t border-border" : ""}
          >
            {section.label && !collapsed && (
              <p className="px-3 pb-2 text-[10px] font-inter font-semibold uppercase tracking-widest text-muted-foreground/70">
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

      <div className="px-2 py-4 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-xs font-bold font-syne">
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
                <p className="text-xs font-medium text-surface-foreground truncate font-inter">
                  {user?.name ?? "User"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate font-inter">
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
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors flex-shrink-0"
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
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="hidden md:flex flex-col h-screen bg-elevated border-r border-border flex-shrink-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <AnimatePresence>
            {!collapsed && (
             <div className="relative h-8 w-32">
              <Image
                src="/logo-lightmode.png"
                alt="CreatorLock logo"
                fill
                className="object-contain dark:hidden"
              />
              <Image
                src="/desktoplogo.png"
                alt="CreatorLock logo"
                fill
                className="object-contain hidden dark:block"
              />
            </div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-muted-foreground hover:bg-border-strong/10 transition-colors flex-shrink-0"
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
              className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-elevated border-r border-border md:hidden"
            >
              <div className="flex items-center justify-between px-4  border-b border-border">
                <div className="relative h-[55px] w-[100px]">
                  <Image
                    src="/desktop-light.png"
                    alt="CreatorLock logo"
                    fill
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src="/desktoplogo.png"
                    alt="CreatorLock logo"
                    fill
                    className="object-contain hidden dark:block"
                  />
                </div>
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-muted-foreground hover:bg-border-strong/10 transition-colors"
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

export const adminNavSections: NavSection[] = [
  {
    items: [
      {
        label: "Payouts",
        href: "/admin/payouts",
        icon: <CreditCard size={ICON_SIZE} weight={ICON_WEIGHT} />,
      },
    ],
  },
];