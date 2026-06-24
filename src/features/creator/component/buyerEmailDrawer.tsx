'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useBuyerEmailDrawer } from '../hooks/useBuyerEmailDrawer';
import { BuyerPill } from './buyerPill';
import { TemplateCard } from './templateCards';
import { STANDARD_TEMPLATES, CUSTOM_TEMPLATE } from '../constants/buyer.constant';
import type { BuyerEmailDrawerProps } from '../types/buyerEmailDrawer.types';

export function BuyerEmailDrawer({ open, buyers, onClose, onSendSuccess }: BuyerEmailDrawerProps) {
  const {
    stage, setStage,
    selectedTemplate, handleSelectTemplate,
    activeBuyers, handleRemoveBuyer,
    subject, setSubject,
    body, setBody,
    couponCode, setCouponCode,
    productTitle, setProductTitle,
    productUrl, setProductUrl,
    handleSend,
    isPending, isError, error,
    canSend, bodyCount,
    drawerRef,
  } = useBuyerEmailDrawer(open, buyers, onClose, onSendSuccess);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="buyer-email-overlay"
            role="presentation"
            onClick={() => { if (!isPending) onClose(); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            key="buyer-email-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Send email to buyers"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] flex flex-col bg-[#0C0C0C]  border-l border-(--border) "
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-(--border) shrink-0">
              <div>
                <h2 className="text-white font-syne font-bold text-sm">
                  {stage === 'success' ? 'Email sent!' : 'Send email'}
                </h2>
                {stage !== 'success' && (
                  <p className="text-(--muted) text-xs mt-0.5">
                    {activeBuyers.length} buyer{activeBuyers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="w-7 h-7 rounded-lg bg-white/4 border border-(--border) text-(--muted) hover:text-white hover:bg-white/7 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all text-sm"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* ── Pick template ── */}
              {stage === 'pick' && (
                <>
                  <p className="text-(--muted) text-[10px] uppercase tracking-wider">Templates</p>
                  <div className="space-y-2">
                    {STANDARD_TEMPLATES.map((t) => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        selected={selectedTemplate?.id === t.id}
                        onSelect={() => handleSelectTemplate(t)}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-(--border)" />
                    <span className="text-(--muted) text-[10px] uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-(--border)" />
                  </div>

                  <TemplateCard
                    template={CUSTOM_TEMPLATE}
                    selected={selectedTemplate?.id === 'custom'}
                    onSelect={() => handleSelectTemplate(CUSTOM_TEMPLATE)}
                  />
                </>
              )}

              {/* ── Compose ── */}
              {stage === 'compose' && (
                <>
                  <button
                    type="button"
                    onClick={() => setStage('pick')}
                    className="flex items-center gap-1.5 text-(--muted) hover:text-white text-xs transition-colors"
                  >
                    ← Back to templates
                  </button>

                  {/* To */}
                  <div>
                    <p className="text-(--muted) text-[10px] uppercase tracking-wider mb-2">To</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeBuyers.map((b) => (
                        <BuyerPill key={b.buyer_id} buyer={b} onRemove={handleRemoveBuyer} />
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="text-(--muted) text-[10px] uppercase tracking-wider mb-2">Subject</p>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      maxLength={150}
                      placeholder="Email subject..."
                      className="w-full bg-(--bg) border border-(--border) rounded-xl px-4 py-3 text-white text-sm focus:border-brand/60 focus:ring-1 focus:ring-brand/20 outline-none transition-all placeholder:text-(--muted)"
                    />
                  </div>

                  {/* Extras: coupon */}
                  {selectedTemplate?.extras === 'coupon' && (
                    <div>
                      <p className="text-(--muted) text-[10px] uppercase tracking-wider mb-2">
                        Coupon code <span className="normal-case text-(--muted)">(optional)</span>
                      </p>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. LOYAL15"
                        className="w-full bg-(--bg) border border-(--border) rounded-xl px-4 py-3 text-brand font-mono text-sm tracking-widest focus:border-brand/60 focus:ring-1 focus:ring-brand/20 outline-none transition-all placeholder:text-(--muted) placeholder:tracking-normal placeholder:font-inter"
                      />
                    </div>
                  )}

                  {/* Extras: product */}
                  {selectedTemplate?.extras === 'product' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-(--muted) text-[10px] uppercase tracking-wider mb-2">
                          Product name <span className="normal-case text-(--muted)">(optional)</span>
                        </p>
                        <input
                          type="text"
                          value={productTitle}
                          onChange={(e) => setProductTitle(e.target.value)}
                          placeholder="e.g. The Ultimate Design Handbook"
                          className="w-full bg-(--bg) border border-(--border) rounded-xl px-4 py-3 text-white text-sm focus:border-brand/60 focus:ring-1 focus:ring-brand/20 outline-none transition-all placeholder:text-(--muted)"
                        />
                      </div>
                      <div>
                        <p className="text-(--muted) text-[10px] uppercase tracking-wider mb-2">
                          Product URL <span className="normal-case text-(--muted)">(optional)</span>
                        </p>
                        <input
                          type="url"
                          value={productUrl}
                          onChange={(e) => setProductUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-(--bg) border border-(--border) rounded-xl px-4 py-3 text-white text-sm focus:border-brand/60 focus:ring-1 focus:ring-brand/20 outline-none transition-all placeholder:text-(--muted)"
                        />
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-(--muted) text-[10px] uppercase tracking-wider">Message</p>
                      <span className={`text-[10px] font-mono ${bodyCount > 4500 ? 'text-red-400' : 'text-(--muted)'}`}>
                        {bodyCount} / 5000
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white/2 border border-(--border) rounded-lg px-3 py-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                      <p className="text-(--muted) text-[11px]">
                        <span className="text-white/60 font-mono">{'{name}'}</span> will be replaced with each buyer&apos;s name
                      </p>
                    </div>

                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      maxLength={5000}
                      rows={7}
                      placeholder="Write your message..."
                      className="w-full bg-(--bg) border border-(--border) rounded-xl px-4 py-3 text-white text-sm focus:border-brand/60 focus:ring-1 focus:ring-brand/20 outline-none transition-all resize-none placeholder:text-(--muted) leading-relaxed"
                    />
                  </div>

                  {/* Inline error */}
                  {isError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <p className="text-red-400 text-xs">
                        {error?.message ?? 'Something went wrong. Please try again.'}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* ── Success ── */}
              {stage === 'success' && (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✅
                  </div>
                  <p className="text-white font-syne font-bold text-base mb-2">Email queued!</p>
                  <p className="text-(--muted) text-sm leading-relaxed">
                    Your email has been queued for{' '}
                    <span className="text-white font-medium">
                      {activeBuyers.length} buyer{activeBuyers.length !== 1 ? 's' : ''}
                    </span>{' '}
                    and will be sent shortly via Resend.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 text-(--muted) hover:text-white text-xs transition-colors underline underline-offset-2"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Footer — compose stage only */}
            {stage === 'compose' && (
              <div className="px-5 py-4 border-t border-(--border) shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStage('pick')}
                    disabled={isPending}
                    className="bg-white/4 hover:bg-white/7 border border-(--border) text-(--muted) hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-syne font-semibold rounded-xl px-4 py-3 text-sm transition-all"
                  >
                    Back
                  </button>
                  <motion.button
                    type="button"
                    onClick={handleSend}
                    disabled={!canSend}
                    whileTap={canSend ? { scale: 0.98 } : undefined}
                    className="flex-1 bg-brand hover:bg-brand-dark disabled:bg-white/6 disabled:text-white/20 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </motion.svg>
                        Sending...
                      </>
                    ) : (
                      'Send email'
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}