import { motion } from 'motion/react';

interface DiscoverErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function DiscoverErrorBanner({ message, onRetry }: DiscoverErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 flex items-center justify-between gap-4 font-inter text-sm"
    >
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="shrink-0 text-red-400 hover:text-red-300 font-syne font-semibold text-xs underline underline-offset-2 transition-colors"
      >
        Retry
      </button>
    </motion.div>
  );
}