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
      className="bg-status-exception/10 border border-status-exception/20 text-status-exception rounded-xl px-4 py-3 flex items-center justify-between gap-4 font-inter text-sm"
    >
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="shrink-0 text-status-exception hover:text-status-exception/80 font-syne font-semibold text-xs underline underline-offset-2 transition-colors"
      >
        Retry
      </button>
    </motion.div>
  );
}