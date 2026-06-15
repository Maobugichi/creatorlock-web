"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const faqs = [
  {
    q: "How long until I receive my payout?",
    a: "Paystack settles to your balance in real time — the moment a buyer pays, your Paystack wallet updates. You can initiate a transfer to your Nigerian bank account at any time. There's no minimum threshold and no waiting period imposed by CreatorLock.",
  },
  {
    q: "What file types can I sell?",
    a: "PDFs, ePubs, MP3s, MP4s, ZIPs, PNGs, PSDs, Figma exports, and most common file formats are supported. If your product is a bundle, ZIP it and upload the archive. Maximum file size is 500MB per product.",
  },
  {
    q: "Does the buyer need an account?",
    a: "No. Buyers enter their email, pay via Paystack, and receive a download key by email — that's the entire flow. We don't ask them to register, and we don't store passwords on their behalf. The email is only used to deliver the download key and receipt.",
  },
  {
    q: "How does the download link security work?",
    a: "Each successful payment generates a unique, single-use download key tied to that transaction. The key expires after 24 hours or after it's been used once — whichever comes first. After expiry, the link returns a 410 Gone response. Buyers who need a re-download can contact you directly; you can reissue a key from your dashboard.",
  },
  {
    q: "Is CreatorLock only for Nigerian creators?",
    a: "The platform is built specifically for Naira pricing and Paystack — so it works best for creators selling to a Nigerian audience. You don't have to be based in Nigeria to create an account, but your buyers will pay in NGN and settlement is to a Paystack balance, so it's most practical if your market is here.",
  },
  {
    q: "What happens if a payment fails?",
    a: "Failed payments never trigger a download key. The buyer's card or bank is not charged — Paystack handles the decline cleanly and the buyer can retry with a different method. You only receive funds for completed transactions.",
  },
  {
    q: "What does CreatorLock charge?",
    a: "CreatorLock takes a 5% platform fee on each sale. Paystack's standard transaction fees apply on top of that (currently 1.5% + ₦100, capped at ₦2,000 for local transactions). There are no monthly fees, no listing fees, and no charge if you make no sales.",
  },
  {
    q: "Can I sell the same product at different prices?",
    a: "Yes. You can create multiple listings for the same file — for example a standard edition and a bundle that includes extras. Each listing has its own price, title, and description. You manage them separately from your creator dashboard.",
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/40 rounded-sm"
      >
        <span className="font-syne font-bold text-base sm:text-lg text-white group-hover:text-brand transition-colors duration-150">
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
          className="text-brand mt-1 shrink-0"
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="font-inter text-sm sm:text-base text-white/55 leading-relaxed pb-6 max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-[var(--bg)] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-xs tracking-widest text-white/30 uppercase mb-4">
            FAQ
          </p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-white leading-tight">
            Questions people
            <br />
            <span className="text-white/40">actually ask.</span>
          </h2>
        </div>

        <div>
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}