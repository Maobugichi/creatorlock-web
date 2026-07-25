"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  created_at: string;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/payouts": "Payouts",
  "/affiliates": "Affiliates",
  "/coupons": "Coupons",
  "/subscribers": "Subscribers",
  "/settings": "Settings",
};

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: unreadCount } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () =>
      api.get<{ data: { count: number } }>("/notifications/unread-count")
        .then((r) => r.data.data.count),
    refetchInterval: 30_000,
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<{ data: Notification[] }>("/notifications")
        .then((r) => r.data.data),
    enabled: open,
    staleTime: 10_000,
  });

  const markRead = useMutation({
    mutationFn: (notificationId: string) =>
      api.patch(`/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const count = unreadCount ?? 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface border border-[var(--border)] rounded-2xl shadow-xl z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <span className="font-syne font-bold text-sm text-white">Notifications</span>
              {count > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                  className="text-xs text-brand hover:text-brand-dark font-syne font-semibold transition-colors disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--muted)] font-inter">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {notifications.map((n) => {
                  const content = (
                    <div
                      className={[
                        "px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer",
                        !n.read ? "bg-brand/[0.04]" : "",
                      ].join(" ")}
                      onClick={() => {
                        if (!n.read) markRead.mutate(n.id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-syne font-semibold text-xs text-white">{n.title}</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-[var(--muted)] mt-1 font-mono">
                            {new Date(n.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                  return n.link ? (
                    <Link key={n.id} href={n.link}>{content}</Link>
                  ) : (
                    <div key={n.id}>{content}</div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Topbar({
  onMobileMenuOpen,
}: {
  onMobileMenuOpen: () => void;
}) {
  const pathname = usePathname();
  useNotificationSocket();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname === path || pathname.startsWith(path + "/")
    )?.[1] ?? "CreatorLock";

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[#0C0C0C] flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <List size={22} weight="bold" />
        </button>

        <h1 className="hidden md:block font-syne font-bold text-lg text-white tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  );
}