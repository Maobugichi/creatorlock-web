'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface PreviewSectionProps {
  preview: {
    url: string;
    category: string | null;
  } | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  document: 'Document preview',
  video: 'Video preview',
  audio: 'Audio preview',
  image: 'Image preview',
};

export default function PreviewSection({ preview }: PreviewSectionProps) {
  const [open, setOpen] = useState(false);

  if (!preview || !preview.category) return null;

  const label = CATEGORY_LABEL[preview.category] ?? 'Preview';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary/40"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-elevated">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-syne text-sm font-bold text-surface-foreground">{label}</p>
          <p className="font-inter text-xs text-muted-foreground">
            Tap to see a sample before you buy
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="preview-overlay"
              role="presentation"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70"
            />
            <motion.div
              key="preview-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Product preview"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto flex max-h-[85vh] max-w-lg -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-surface sm:inset-x-auto"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-syne text-sm font-bold text-surface-foreground">{label}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground text-sm transition-colors hover:text-surface-foreground"
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto p-5">
                {preview.category === 'document' && (
                  <div className="overflow-hidden rounded-xl border border-border">
                    <iframe src={`${preview.url}#toolbar=0`} className="h-[55vh] w-full" title="Preview" />
                  </div>
                )}

                {preview.category === 'video' && (
                  <video controls autoPlay className="w-full rounded-xl border border-border">
                    <source src={preview.url} />
                  </video>
                )}

                {preview.category === 'audio' && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-elevated px-4 py-3">
                    <audio controls autoPlay className="w-full">
                      <source src={preview.url} />
                    </audio>
                  </div>
                )}

                {preview.category === 'image' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.url} alt="Product preview" className="w-full rounded-xl border border-border" />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}