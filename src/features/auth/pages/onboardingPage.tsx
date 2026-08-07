"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useOnboarding } from "../api/useOnboarding";
import { nameToSlug } from "../utils/slug";
import { OnboardingProgress } from "../components/onboardingProgress";
import { OnboardingStepRole } from "../components/onboardingStepRole";
import { OnboardingStepProfile } from "../components/onboardingStepProfile";
import { OnboardingStepSlug } from "../components/onboardingStepSlug";
import type { Role, OnboardingStep } from "../types/auth.types";

export default function OnboardingPage() {
  const { mutate, isPending, isError, error } = useOnboarding();

  const [step, setStep] = useState<OnboardingStep>("role");
  const [role, setRole] = useState<Role>("creator");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState("");

  const steps: OnboardingStep[] = role === "creator"
    ? ["role", "profile", "slug"]
    : ["role", "profile"];

  const handleNameNext = () => {
    if (!name.trim()) return;
    if (role === "creator") {
      setSlug(nameToSlug(name));
      setStep("slug");
    } else {
      mutate({ role, name });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 font-inter">
      <div className="w-full max-w-md">
        <OnboardingProgress steps={steps} currentStep={step} />

        <AnimatePresence mode="wait">
          {step === "role" && (
            <OnboardingStepRole
              role={role}
              onChange={setRole}
              onNext={() => setStep("profile")}
            />
          )}
          {step === "profile" && (
            <OnboardingStepProfile
              role={role}
              name={name}
              isPending={isPending}
              onChange={setName}
              onBack={() => setStep("role")}
              onNext={handleNameNext}
            />
          )}
          {step === "slug" && (
            <OnboardingStepSlug
              slug={slug}
              slugError={slugError}
              isPending={isPending}
              isError={isError}
              error={error}
              onChange={(val) => { setSlug(val); setSlugError(""); }}
              onBack={() => setStep("profile")}
              onComplete={() => {
                if (!slug.trim()) return;
                mutate({ role, name, storeSlug: slug });
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}