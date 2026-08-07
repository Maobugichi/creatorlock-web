"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpgradeToCreator } from "@/features/buyer/api/useBuyerProfile";

function sanitiseSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

export function BecomeCreatorCard() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const { mutate, isPending, isError, errorMessage } = useUpgradeToCreator();

  const handleSubmit = () => {
    if (!slug.trim()) return;
    mutate(
      { storeSlug: slug },
      {
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        },
      }
    );
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-syne font-bold text-lg text-surface-foreground">Become a Creator</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Start selling your own digital products on CreatorLock.
        </p>
      </div>

      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">
          Store URL
        </label>
        <div className="flex items-center bg-elevated border border-border rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
          <span className="px-3 py-2.5 text-sm text-muted-foreground border-r border-border whitespace-nowrap font-inter">
            creatorlock.co/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(sanitiseSlug(e.target.value))}
            placeholder="your-store"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-surface-foreground placeholder:text-muted-foreground outline-none font-inter"
          />
        </div>
      </div>

      {isError && (
        <div className="bg-status-exception/10 border border-status-exception/20 rounded-xl px-4 py-3 text-sm text-status-exception">
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!slug.trim() || isPending}
        className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Setting up…
          </span>
        ) : (
          "Launch my store"
        )}
      </button>
    </div>
  );
}