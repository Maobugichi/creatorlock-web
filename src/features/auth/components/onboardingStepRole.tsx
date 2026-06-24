"use client";

import { motion } from "motion/react";
import { RoleSelector } from "./role-selector";
import type { Role } from "../types/auth.types";

interface OnboardingStepRoleProps {
  role: Role;
  onChange: (role: Role) => void;
  onNext: () => void;
}

export function OnboardingStepRole({ role, onChange, onNext }: OnboardingStepRoleProps) {
  return (
    <motion.div
      key="role"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="font-syne font-extrabold text-2xl text-white text-center mb-1">
        How will you use CreatorLock?
      </h1>
      <p className="text-sm text-white/30 text-center mb-7">
        You can always change this later.
      </p>
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7">
        <RoleSelector value={role} onChange={onChange} />
        <button
          onClick={onNext}
          className="w-full bg-brand hover:bg-brand-dark text-white font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}