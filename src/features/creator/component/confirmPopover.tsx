'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface ConfirmPopoverProps {
  action: 'publish' | 'unpublish';
  onConfirm: () => void;
  onCancel: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 640px)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

function ConfirmContent({ action, onConfirm, onCancel }: ConfirmPopoverProps) {
  const isUnpublish = action === 'unpublish';
  return (
    <>
      <p className="font-inter text-muted-foreground text-xs mb-3 leading-relaxed">
        {isUnpublish
          ? "This will hide the product from your store. Confirm?"
          : "This will make the product visible in your store. Confirm?"}
      </p>
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-surface-foreground text-xs font-inter transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onConfirm}
          className={`flex-1 py-1.5 rounded-lg text-xs font-syne font-semibold transition-colors ${
            isUnpublish
              ? 'bg-status-warning/20 text-status-warning hover:bg-status-warning/30'
              : 'bg-status-positive/20 text-status-positive hover:bg-status-positive/30'
          }`}
        >
          {isUnpublish ? 'Unpublish' : 'Publish'}
        </motion.button>
      </div>
    </>
  );
}

function DesktopPopover({ action, onConfirm, onCancel }: ConfirmPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onCancel]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-full right-0 mb-2 z-20 w-48 bg-elevated border border-border rounded-xl p-3 shadow-xl origin-bottom-right"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-elevated border-r border-b border-border rotate-45" />
      <ConfirmContent action={action} onConfirm={onConfirm} onCancel={onCancel} />
    </motion.div>
  );
}

function MobileBottomSheet({ action, onConfirm, onCancel }: ConfirmPopoverProps) {
  const isUnpublish = action === 'unpublish';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className="w-full bg-elevated border-t border-border rounded-t-2xl px-5 pt-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border-strong mx-auto mb-5" />
        <p className="font-syne font-bold text-surface-foreground text-base mb-1">
          {isUnpublish ? 'Unpublish product?' : 'Publish product?'}
        </p>
        <p className="font-inter text-muted-foreground text-sm mb-6 leading-relaxed">
          {isUnpublish
            ? "This will hide the product from your store. Buyers won't be able to purchase it."
            : 'This will make your product visible and purchasable in your store.'}
        </p>
        <div className="flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className={`w-full py-3.5 rounded-xl text-sm font-syne font-semibold transition-colors border ${
              isUnpublish
                ? 'bg-status-warning/20 text-status-warning hover:bg-status-warning/30 border-status-warning/20'
                : 'bg-status-positive/20 text-status-positive hover:bg-status-positive/30 border-status-positive/20'
            }`}
          >
            {isUnpublish ? 'Yes, unpublish' : 'Yes, publish'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="w-full py-3.5 rounded-xl text-sm font-inter text-muted-foreground hover:text-surface-foreground border border-border bg-elevated transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ConfirmPopover(props: ConfirmPopoverProps) {
  const isMobile = useIsMobile();
  return isMobile ? <MobileBottomSheet {...props} /> : <DesktopPopover {...props} />;
}