import Link from "next/link";
import { motion } from "framer-motion";

export function ForgotPasswordSuccess() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-4 py-4"
    >
      <div className="w-14 h-14 rounded-full bg-status-positive/10 border border-status-positive/20 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" className="text-status-positive" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 6L12 13L2 6" stroke="currentColor" className="text-status-positive" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="font-syne font-bold text-surface-foreground text-lg mb-1">Check your inbox</p>
        <p className="text-sm text-muted-foreground font-inter leading-relaxed">
          If that email exists on CreatorLock, a reset link is on its way. Check your spam too.
        </p>
      </div>
      <Link href="/login" className="text-sm text-primary hover:underline font-inter mt-2">
        Back to sign in
      </Link>
    </motion.div>
  );
}