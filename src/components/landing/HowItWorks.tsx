"use client";

import { motion, useReducedMotion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2L12 14M12 2L8 6M12 2L16 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 14v5a1 1 0 001 1h14a1 1 0 001-1v-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Upload your product",
    description:
      "Add your eBook, course, template, or audio file. Set your Naira price. Your store is live in minutes.",
  },
  {
    number: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3 10h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 15h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Buyer pays via Paystack",
    description:
      "Card, bank transfer, or USSD — every Nigerian payment method works. No foreign card required, no middlemen.",
  },
  {
    number: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 4h16v2.5a2 2 0 01-1.2 1.84l-5.6 2.4a2 2 0 01-1.6 0l-5.6-2.4A2 2 0 014 6.5V4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M4 4v-.5A1.5 1.5 0 015.5 2h13A1.5 1.5 0 0120 3.5V4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 11v9M12 20l-3-3M12 20l3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Secure download key delivered",
    description:
      "The buyer gets a time-limited download key by email. One use, then it expires. No piracy workarounds, no link sharing.",
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="bg-background py-24 px-6 scroll-mt-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest text-foreground/30 uppercase mb-4">
            How it works
          </p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-foreground max-w-sm leading-tight">
            Three steps.
            <br />
            <span className="text-foreground/40">That&apos;s the whole thing.</span>
          </h2>
        </div>

        {/* Steps */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border"
        >
          {steps.map(({ number, icon, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: reduce ? 0 : i * 0.1,
              }}
              className="bg-background p-8 flex flex-col gap-6"
            >
              {/* Icon + number row */}
              <div className="flex items-start justify-between">
                <div className="text-primary">{icon}</div>
                <span className="font-mono text-xs text-foreground/20">{number}</span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3 className="font-syne font-bold text-lg text-foreground leading-snug">
                  {title}
                </h3>
                <p className="font-inter text-sm text-foreground/50 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector line — desktop only, decorative */}
        <div aria-hidden className="hidden sm:flex items-center mt-6 px-8 gap-0">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}