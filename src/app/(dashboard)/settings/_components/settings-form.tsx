"use client";

import { useRef, useState, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import Input from "@/components/ui/input";

import { Section } from "./section";
import { ImageUpload } from "./image-upload";
import { useCreatorProfile } from "../_hooks/use-creator-profile";
import { useSaveProfile } from "../_hooks/use-save-profile";
import { SettingsFormValues } from "../_types";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {([180, 240, 160] as const).map((h, i) => (
        <div key={i} style={{ height: h }} className="bg-white/[0.03] rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function SettingsForm() {
  const { control, register, handleSubmit, reset } = useForm<SettingsFormValues>({
    defaultValues: {
      display_name: "",
      bio: "",
      store_slug: "",
      profile_image: null,
      banner_image: null,
      twitter: "",
      instagram: "",
      youtube: "",
      website: "",
    },
  });

  const { isLoading, originalSlug } = useCreatorProfile(reset);
  const { save, saving, saved, errorMessage, resetMutation } = useSaveProfile(reset);

  const currentSlug = useWatch({ control, name: "store_slug" });
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback(
    async (value: string) => {
      if (!value || value === originalSlug) {
        setSlugStatus("idle");
        return;
      }
      setSlugStatus("checking");
      try {
        await api.get(`/creator/check-slug?slug=${encodeURIComponent(value)}`);
        setSlugStatus("available");
      } catch {
        setSlugStatus("taken");
      }
    },
    [originalSlug],
  );

  const handleSlugBlur = () => {
    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    slugCheckTimer.current = setTimeout(() => checkSlug(currentSlug), 300);
  };

  const onSubmit = handleSubmit((values) => {
    resetMutation();
    save(values);
  });

  const slugChanged = currentSlug !== originalSlug;

  if (isLoading) return <SettingsSkeleton />;

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Error */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 font-inter"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 font-inter flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5L20 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Profile saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images */}
      <Section title="Store appearance" sub="Your public profile and banner images">
        <div className="space-y-4">
          <Controller
            control={control}
            name="banner_image"
            render={({ field }) => (
              <ImageUpload
                label="Banner image (recommended: 1200×300)"
                current={field.value}
                aspectClass="h-32 w-full"
                onUploaded={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="profile_image"
            render={({ field }) => (
              <ImageUpload
                label="Profile image"
                current={field.value}
                aspectClass="h-24 w-24 rounded-full"
                onUploaded={field.onChange}
              />
            )}
          />
        </div>
      </Section>

      {/* Profile details */}
      <Section title="Profile details" sub="How you appear on your public storefront">
        <div className="space-y-4">
          <Input label="Display name" type="text" placeholder="Adaeze Okonkwo" {...register("display_name")} />

          <div>
            <label className="block text-xs text-[var(--muted)] mb-1.5 font-inter tracking-wide">Bio</label>
            <textarea
              {...register("bio")}
              placeholder="Tell buyers a bit about yourself and what you create..."
              rows={4}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors resize-none font-inter"
            />
          </div>

          {/* Store slug */}
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1.5 font-inter tracking-wide">Store URL</label>
            <div
              className={cn(
                "flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden",
                "focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/20 transition-colors",
              )}
            >
              <span className="px-4 py-3 text-sm text-white/20 font-inter border-r border-[var(--border)] whitespace-nowrap">
                creatorlock.com/store/
              </span>
              <input
                {...register("store_slug", {
                  onChange: () => setSlugStatus("idle"),
                  setValueAs: (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                })}
                onBlur={handleSlugBlur}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none font-inter"
                placeholder="your-store"
              />
              <div className="px-3 flex items-center">
                {slugStatus === "checking" && (
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin inline-block" />
                )}
                {slugStatus === "available" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-400">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {slugStatus === "taken" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-400">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>

            <AnimatePresence>
              {slugChanged && slugStatus !== "taken" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-orange-400/80 font-inter mt-2 flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line
                      x1="12"
                      y1="17"
                      x2="12.01"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Changing your slug will break any existing share links
                </motion.p>
              )}
              {slugStatus === "taken" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400 font-inter mt-2"
                >
                  This slug is already taken
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* Social links */}
      <Section title="Social links" sub="Shown on your public storefront — all optional">
        <div className="space-y-3">
          {(
            [
              { name: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/yourhandle" },
              { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
              { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
              { name: "website", label: "Website", placeholder: "https://yourwebsite.com" },
            ] as const
          ).map(({ name, label, placeholder }) => (
            <Input key={name} label={label} type="url" placeholder={placeholder} {...register(name)} />
          ))}
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={onSubmit}
          disabled={saving || slugStatus === "taken" || slugStatus === "checking"}
          className="bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-syne font-semibold rounded-xl px-8 py-3 text-sm transition-colors active:scale-[0.98] flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </div>
  );
}