import { Suspense } from "react";
import ResetPasswordPage from "@/features/auth/pages/resetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}