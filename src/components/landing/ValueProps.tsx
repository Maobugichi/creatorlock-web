"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useRef } from "react";

function formatNGN(cents: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const props = [
  {
    tag: "Pricing",
    headline: "Sell in Naira. Get paid in Naira.",
    body: "Set your price in the currency your buyers actually use. No conversion rates, no withheld funds, no explaining why payment failed.",
    detail: (
      <div className="flex items-baseline gap-2 mt-auto pt-6">
        <span className="font-mono text-2xl text-brand">
          {formatNGN(500000)}
        </span>
        <span className="font-mono text-sm text-white/30">your price, exactly</span>
      </div>
    ),
  },
  {
    tag: "Settlement",
    headline: "Paystack pays you. Instantly.",
    body: "No 14-day holding periods. No manual withdrawal requests. When a buyer pays, your Paystack balance updates — transfer to your bank on your schedule.",
    detail: (
      <div className="mt-auto pt-6 flex flex-col gap-1">
        {[
          { label: "Sale", amount: 500000, dim: false },
          { label: "CreatorLock fee (5%)", amount: -25000, dim: true },
          { label: "You receive", amount: 475000, dim: false },
        ].map(({ label, amount, dim }) => (
          <div key={label} className="flex justify-between items-center">
            <span className={`font-inter text-xs ${dim ? "text-white/30" : "text-white/60"}`}>
              {label}
            </span>
            <span
              className={`font-mono text-xs ${
                dim
                  ? "text-white/30"
                  : amount > 0
                  ? "text-brand"
                  : "text-white/40"
              }`}
            >
              {amount < 0 ? `−${formatNGN(Math.abs(amount))}` : formatNGN(amount)}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Checkout",
    headline: "Buyers don't need an account.",
    body: "Guest checkout only. Enter an email, pay, get the download key. Zero friction between intent and purchase — no sign-up wall to kill the sale.",
    detail: (
      <div className="mt-auto pt-6">
        <div className="bg-[var(--bg)] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand shrink-0" />
          <span className="font-inter text-xs text-white/50">
            No account required — just your email
          </span>
        </div>
      </div>
    ),
  },
  {
    tag: "Security",
    headline: "Download links that expire.",
    body: "Every purchase generates a single-use, time-limited download key sent by email. Once used or expired, it's gone. Your files stay yours.",
    detail: (
      <div className="mt-auto pt-6 flex flex-col gap-2">
        <div className="flex justify-between font-mono text-xs text-white/30">
          <span>KEY</span>
          <span>STATUS</span>
          <span>EXPIRES</span>
        </div>
        {[
          { key: "clk_9f2a…", status: "used", color: "text-white/20" },
          { key: "clk_4e8b…", status: "active", color: "text-brand" },
          { key: "clk_1c3d…", status: "expired", color: "text-white/20" },
        ].map(({ key, status, color }) => (
          <div key={key} className="flex justify-between font-mono text-xs">
            <span className="text-white/50">{key}</span>
            <span className={color}>{status}</span>
            <span className="text-white/25">24 h</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function ValueProps() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="bg-[var(--bg)] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest text-white/30 uppercase mb-4">
            Why CreatorLock
          </p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-white leading-tight">
            Built around outcomes,
            <br />
            <span className="text-white/40">not feature lists.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {props.map(({ tag, headline, body, detail }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: reduce ? 0 : i * 0.08,
              }}
              className="bg-surface border border-[var(--border)] rounded-2xl p-5 flex flex-col min-h-[280px]"
            >
              {/* Tag */}
              <span className="font-mono text-xs text-brand/70 tracking-widest uppercase mb-4">
                {tag}
              </span>

              {/* Text */}
              <h3 className="font-syne font-bold text-lg text-white leading-snug mb-2">
                {headline}
              </h3>
              <p className="font-inter text-sm text-white/50 leading-relaxed">
                {body}
              </p>

              {/* Detail — visual accent unique to each card */}
              {detail}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}