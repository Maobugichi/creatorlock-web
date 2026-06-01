"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar, { creatorNavItems } from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0C0C0C] overflow-hidden font-inter">

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        navItems={creatorNavItems}
      />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden"
            >
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
                navItems={creatorNavItems}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
      </div>
    </div>
  );
}