
import { Suspense } from "react";
import SignupPage from "@/features/auth/pages/signupPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignupPage />
    </Suspense>
  );
}