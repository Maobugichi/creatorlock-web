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
          className="bg-red-500/8 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 font-inter"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}