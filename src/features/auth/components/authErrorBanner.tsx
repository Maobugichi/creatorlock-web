"use client";
import { motion, AnimatePresence } from "framer-motion";

export function AuthErrorBanner({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="bg-status-exception/8 border border-status-exception/20 text-status-exception text-sm rounded-xl px-4 py-3 mb-5 font-inter"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}