"use client";

import { motion } from "motion/react";
import type { OnboardingStep } from "../types/auth.types";

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep: OnboardingStep;
}

export function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          animate={{
            width: i === stepIndex ? 20 : 6,
            opacity: i <= stepIndex ? 1 : 0.2,
          }}
          className="h-1.5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ))}
    </div>
  );
}