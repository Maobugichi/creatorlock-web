"use client";

import { motion } from "motion/react";
import Input from "@/components/ui/input";
import type { Role } from "../types/auth.types";

interface OnboardingStepProfileProps {
  role: Role;
  name: string;
  isPending: boolean;
  onChange: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingStepProfile({
  role, name, isPending, onChange, onBack, onNext,
}: OnboardingStepProfileProps) {
  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h1 className="font-syne font-extrabold text-2xl text-white text-center mb-1">
        What should we call you?
      </h1>
      <p className="text-sm text-white/30 text-center mb-7">
        {role === "creator"
          ? "This is your public display name on your store."
          : "This is how other people will see you."}
      </p>
      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 sm:p-7 space-y-4">
        <Input
          label={role === "creator" ? "Display name" : "Full name"}
          type="text"
          name="name"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder={role === "creator" ? "Adaeze Creates" : "Adaeze Okonkwo"}
          required
        />
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border border-white/10 hover:border-white/20 text-white/50 hover:text-white font-medium rounded-xl py-3.5 text-sm transition-colors font-inter"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!name.trim() || isPending}
            className="flex-1 bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
          >
            {isPending && role === "buyer" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finishing...
              </>
            ) : (
              role === "creator" ? "Continue" : "Finish"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}