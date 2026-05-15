"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Role } from "../types";

const ROLES: { id: Role; label: string; description: string }[] = [
  {
    id: "creator",
    label: "I'm a Creator",
    description: "Sell products, protect your work, get paid in naira.",
  },
  {
    id: "buyer",
    label: "I'm a Buyer",
    description: "Buy digital products from Nigerian creatives.",
  },
];

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  const activeDescription = ROLES.find((r) => r.id === value)?.description;

  return (
    <>
      <div className="relative flex p-1 bg-white/3 rounded-xl border border-white/[0.06] mb-2">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className="relative flex-1 py-2 rounded-lg text-sm font-medium z-10 transition-colors duration-200"
            style={{
              color: value === r.id ? "#fff" : "rgba(255,255,255,0.35)",
            }}
          >
            {value === r.id && (
              <motion.div
                layoutId="role-pill"
                className="absolute inset-0 bg-brand rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{r.label}</span>
          </button>
        ))}
      </div>

      <div className="h-8 flex items-center justify-center mb-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-white/30 text-center font-inter leading-relaxed"
          >
            {activeDescription}
          </motion.p>
        </AnimatePresence>
      </div>
    </>
  );
}