"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-svh bg-[var(--bg)] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle radial glow — brand orange bled into the canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(251,92,6,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Eyebrow */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="font-mono text-sm tracking-widest text-brand uppercase"
        >
          CreatorLock
        </motion.p>

        {/* H1 — Syne ExtraBold, spec headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="font-syne font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight"
        >
          Turn what you know
          <br />
          <span className="text-brand">into what you earn.</span>
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="font-inter text-base sm:text-lg text-white/60 max-w-xl leading-relaxed"
        >
          The marketplace built for Nigerian creators. Sell eBooks, courses,
          templates, and music — paid in Naira, delivered instantly, zero
          platform drama.
        </motion.p>

        {/* Primary CTA — scroll anchor to #how-it-works */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              inline-block
              bg-brand hover:bg-brand-dark active:scale-[0.98]
              text-white font-syne font-semibold
              text-base sm:text-lg
              px-8 py-4
              rounded-xl
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60
            "
          >
            Discover CreatorLock
          </a>
        </motion.div>
      </div>

      {/* Down-arrow nudge */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20"
      >
        <span className="font-mono text-xs tracking-widest uppercase">scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M8 4v12M8 16l-4-4M8 16l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}