"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AuthNav from "@/components/ui/authnav";
import Input from "@/components/ui/input";
import { useResetPassword } from "../api/useResetPassword";
import { AuthErrorBanner } from "../components/authErrorBanner";
import { ResetPasswordInvalid } from "../components/resetPasswordInvalid";
import { ResetPasswordSuccess } from "../components/resetPasswordSuccess";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, isPending, isSuccess, errorMessage } = useResetPassword();

  if (!token) return <ResetPasswordInvalid />;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const new_password = fd.get("new_password") as string;
    const confirm = fd.get("confirm_password") as string;
    if (new_password !== confirm) return;
    resetPassword({ token, new_password });
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col font-inter w-full">
      <AuthNav linkLabel="Back to login" linkHref="/login" />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-xs text-white/30 tracking-wide">Set a new password</span>
          </div>

          <h1 className="font-syne font-extrabold text-[28px] text-white text-center tracking-tight mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-white/30 text-center mb-8 font-inter">
            Choose a strong password you haven&apos;t used before.
          </p>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-7">
            <AuthErrorBanner message={errorMessage} />

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <ResetPasswordSuccess />
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  exit={{ opacity: 0 }}
                >
                  <Input
                    label="New password"
                    type="password"
                    name="new_password"
                    required
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    name="confirm_password"
                    required
                    placeholder="••••••••"
                    minLength={8}
                  />

                  <p className="text-xs text-white/20 font-inter">Minimum 8 characters</p>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3.5 text-sm transition-colors flex items-center justify-center gap-2 font-inter"
                  >
                    {isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}