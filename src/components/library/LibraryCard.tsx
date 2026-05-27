"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import api from "@/lib/api";
import type { LibraryItem } from "@/types/library.types";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatNGN = (cents: number): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(cents / 100);

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const isExpired = (iso: string): boolean => new Date(iso) < new Date();

// ─── ResendButton ────────────────────────────────────────────────────────────

const COOLDOWN_SECONDS = 60;

interface ResendButtonProps {
  orderId: string;
  revoked: boolean;
}

function ResendButton({ orderId, revoked }: ResendButtonProps) {
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log(revoked)
  const { mutate, isPending } = useMutation<
    { success: boolean; message: string },
    Error
  >({
    mutationFn: async () => {
      const res = await api.post<{ success: boolean; message: string }>(
        `/buyer/library/${orderId}/resend`
      );
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      setErrorMessage(null);

      // Start immutable cooldown countdown — cannot be interrupted
      let remaining = COOLDOWN_SECONDS;
      setCooldownRemaining(remaining);

      const interval = setInterval(() => {
        remaining -= 1;
        setCooldownRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setSuccessMessage(null);
        }
      }, 1000);
    },
    onError: (err) => {
      setErrorMessage(err.message ?? "Failed to resend. Please try again.");
      setSuccessMessage(null);
    },
  });

  const isOnCooldown = cooldownRemaining > 0;
  const isDisabled = isPending || isOnCooldown || revoked;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => mutate()}
        disabled={isDisabled}
        className={[
          "w-full font-syne font-semibold text-sm rounded-xl px-4 py-2.5 transition-all active:scale-[0.98]",
          revoked
            ? "bg-white/5 text-white/20 cursor-not-allowed"
            : isOnCooldown
              ? "bg-white/5 text-white/40 cursor-not-allowed"
              : isPending
                ? "bg-brand/60 text-white/60 cursor-wait"
                : "bg-brand hover:bg-brand-dark text-white cursor-pointer",
        ].join(" ")}
      >
        {isPending
          ? "Sending…"
          : isOnCooldown
            ? `Resend available in ${cooldownRemaining}s`
            : revoked
              ? "Access Revoked"
              : "Resend Download Link"}
      </button>

      <AnimatePresence mode="wait">
        {successMessage && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-emerald-400 font-inter text-center"
          >
            {successMessage}
          </motion.p>
        )}
        {errorMessage && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-400 font-inter text-center"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── DownloadMeter ───────────────────────────────────────────────────────────

interface DownloadMeterProps {
  used: number;
  max: number;
}

function DownloadMeter({ used, max }: DownloadMeterProps) {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const exhausted = used >= max;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 font-inter">Downloads used</span>
        <span
          className={[
            "text-xs font-mono",
            exhausted ? "text-red-400" : "text-white/60",
          ].join(" ")}
        >
          {used} / {max}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={[
            "h-full rounded-full",
            exhausted ? "bg-red-500/70" : "bg-brand/70",
          ].join(" ")}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── StatusPill ──────────────────────────────────────────────────────────────

interface StatusPillProps {
  revoked: boolean;
  expiresAt: string;
}

function StatusPill({ revoked, expiresAt }: StatusPillProps) {
  if (revoked) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-inter px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
        Revoked
      </span>
    );
  }

  if (isExpired(expiresAt)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-inter px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
        Expired
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-inter px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
      Active
    </span>
  );
}

// ─── LibraryCard (PurchaseCard) ──────────────────────────────────────────────

interface LibraryCardProps {
  item: LibraryItem;
}

export function LibraryCard({ item }: LibraryCardProps) {
  const expired = isExpired(item.token_expires_at);
  const inaccessible = item.token_revoked || expired;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-surface border border-[var(--border)] rounded-2xl p-5 flex flex-col gap-5"
    >
      {/* ── Product Identity Row ── */}
      <div className="flex gap-4 items-start">
        {/* Thumbnail */}
        <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/[0.04] border border-[var(--border)]">
          {item.product_thumbnail ? (
            <img
              src={item.product_thumbnail}
              alt={item.product_title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Title + Creator + Status */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-syne font-bold text-white text-sm leading-snug line-clamp-2">
              {item.product_title}
            </h3>
            <StatusPill
              revoked={item.token_revoked}
              expiresAt={item.token_expires_at}
            />
          </div>
          <p className="text-xs text-white/40 font-inter truncate">
            by{" "}
            <span className="text-white/60">{item.creator_name}</span>
          </p>
        </div>
      </div>

      {/* ── Financial + Date Row ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-white/30 font-inter">Amount paid</span>
          <span className="font-mono text-white text-sm">
            {formatNGN(item.amount_cents)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-white/30 font-inter">Purchased</span>
          <span className="font-mono text-white/70 text-sm">
            {formatDate(item.purchased_at)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-white/30 font-inter">Link expires</span>
          <span
            className={[
              "font-mono text-sm",
              inaccessible ? "text-red-400/70" : "text-white/70",
            ].join(" ")}
          >
            {item.token_revoked ? "—" : formatDate(item.token_expires_at)}
          </span>
        </div>
      </div>

      {/* ── Download Meter ── */}
      <DownloadMeter
        used={item.downloads_used}
        max={item.max_downloads}
      />

      {/* ── Divider ── */}
      <div className="h-px w-full bg-white/[0.06]" />

      {/* ── Resend Action ── */}
      <ResendButton orderId={item.order_id} revoked={item.token_revoked} />
    </motion.article>
  );
}