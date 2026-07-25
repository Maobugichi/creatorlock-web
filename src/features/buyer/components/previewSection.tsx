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
        className="flex w-full items-center gap-3 rounded-2xl border p-5 text-left transition-colors hover:border-brand/40"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{ borderColor: 'var(--border)', background: '#0C0C0C' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-brand)' }}>
            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-syne text-sm font-bold text-white">{label}</p>
          <p className="font-inter text-xs" style={{ color: 'var(--muted)' }}>
            Tap to see a sample before you buy
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ color: 'var(--muted)' }}>
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
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 rounded-2xl border sm:inset-x-auto"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-syne text-sm font-bold text-white">{label}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition-colors hover:text-white"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                {preview.category === 'document' && (
                  <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <iframe src={`${preview.url}#toolbar=0`} className="h-[70vh] w-full" title="Preview" />
                  </div>
                )}

                {preview.category === 'video' && (
                  <video controls autoPlay className="w-full rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <source src={preview.url} />
                  </video>
                )}

                {preview.category === 'audio' && (
                  <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: '#0C0C0C' }}>
                    <audio controls autoPlay className="w-full">
                      <source src={preview.url} />
                    </audio>
                  </div>
                )}

                {preview.category === 'image' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.url} alt="Product preview" className="w-full rounded-xl border" style={{ borderColor: 'var(--border)' }} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}