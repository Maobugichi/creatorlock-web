import { Suspense } from "react";
import OnboardingPage from "@/features/auth/pages/onboardingPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OnboardingPage />
    </Suspense>
  );
}