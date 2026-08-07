import { motion } from "framer-motion";

export function ResetPasswordSuccess() {
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
          <path
            d="M5 12L10 17L20 7"
            stroke="currentColor"
            className="text-status-positive"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-syne font-bold text-surface-foreground text-lg mb-1">Password updated!</p>
        <p className="text-sm text-muted-foreground font-inter">
          Redirecting you to sign in...
        </p>
      </div>
    </motion.div>
  );
}