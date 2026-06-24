import Link from "next/link";

export function ResetPasswordInvalid() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4 font-inter">
      <div className="text-center max-w-sm">
        <div className="font-syne font-extrabold text-xl text-white mb-2">
          Creator<span className="text-brand">Lock</span>
        </div>
        <p className="text-white/40 text-sm mb-4">
          This reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="text-brand hover:underline text-sm">
          Request a new one
        </Link>
      </div>
    </div>
  );
}