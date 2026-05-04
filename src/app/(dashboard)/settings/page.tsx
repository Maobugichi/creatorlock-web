"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Input from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreatorProfile {
  id: string;
  user_id: string;
  display_name: string;
  store_slug: string;
  bio: string | null;
  profile_image: string | null;
  banner_image: string | null;
  social_links: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  } | null;
  payout_enabled: boolean;
  status: string;
}

interface UpdateProfileInput {
  display_name?: string;
  bio?: string;
  profile_image?: string;
  banner_image?: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

interface ApiError {
  response?: { data?: { message?: string } };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uploadImage = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post<{ url: string }>("/products/upload-image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
};

// ─── Image upload component ───────────────────────────────────────────────────

function ImageUpload({
  label,
  current,
  aspectClass,
  onUploaded,
}: {
  label: string;
  current: string | null;
  aspectClass: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(current);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(current);
  }, [current]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onUploaded(url);
      setPreview(url);
    } catch {
      setPreview(current);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-2 font-inter">{label}</p>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] cursor-pointer group",
          aspectClass
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/20">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-white text-xs font-inter font-medium">
              {preview ? "Change" : "Upload"}
            </span>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-[var(--border)] rounded-2xl p-6">
      <div className="mb-5 pb-4 border-b border-[var(--border)]">
        <h2 className="font-syne font-bold text-white text-base">{title}</h2>
        <p className="text-xs text-[var(--muted)] font-inter mt-0.5">{sub}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const queryClient = useQueryClient();

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [slug, setSlug] = useState("");
  const [originalSlug, setOriginalSlug] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [social, setSocial] = useState({
    twitter: "",
    instagram: "",
    youtube: "",
    website: "",
  });

  // Slug check state
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Success feedback
  const [saved, setSaved] = useState(false);

  // ── Load profile ────────────────────────────────────────────────────────────
  const { isLoading } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: () =>
      api.get<{ data: CreatorProfile }>("/creator/me").then((r) => r.data.data),
    onSuccess: (data: CreatorProfile) => {
      setDisplayName(data.display_name ?? "");
      setBio(data.bio ?? "");
      setSlug(data.store_slug ?? "");
      setOriginalSlug(data.store_slug ?? "");
      setProfileImage(data.profile_image ?? null);
      setBannerImage(data.banner_image ?? null);
      setSocial({
        twitter: data.social_links?.twitter ?? "",
        instagram: data.social_links?.instagram ?? "",
        youtube: data.social_links?.youtube ?? "",
        website: data.social_links?.website ?? "",
      });
    },
  });

  // ── Save profile ────────────────────────────────────────────────────────────
  const { mutate: save, isPending: saving, isError, error } = useMutation({
    mutationFn: (updates: UpdateProfileInput) =>
      api.patch("/creator/me", updates).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      setOriginalSlug(slug);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = () => {
    const updates: UpdateProfileInput = {
      display_name: displayName,
      bio: bio || undefined,
      ...(profileImage ? { profile_image: profileImage } : {}),
      ...(bannerImage ? { banner_image: bannerImage } : {}),
      social_links: {
        ...(social.twitter ? { twitter: social.twitter } : {}),
        ...(social.instagram ? { instagram: social.instagram } : {}),
        ...(social.youtube ? { youtube: social.youtube } : {}),
        ...(social.website ? { website: social.website } : {}),
      },
    };

    // Only include slug if it changed and is available
    if (slug !== originalSlug && slugStatus === "available") {
      // Backend handles slug via store_slug — not in UpdateCreatorProfileInput
      // slug changes require separate endpoint if available
    }

    save(updates);
  };

  // ── Slug availability check (debounced on blur) ─────────────────────────────
  const checkSlug = useCallback(async (value: string) => {
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
  }, [originalSlug]);

  const handleSlugBlur = () => {
    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    slugCheckTimer.current = setTimeout(() => checkSlug(slug), 300);
  };

  const errorMessage = isError
    ? (error as ApiError)?.response?.data?.message ?? "Failed to save. Try again."
    : null;

  const slugChanged = slug !== originalSlug;

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {[180, 240, 160].map((h, i) => (
          <div key={i} className={`h-[${h}px] bg-white/[0.03] rounded-2xl animate-pulse`} />
        ))}
      </div>
    );
  }

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
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Profile saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images */}
      <Section title="Store appearance" sub="Your public profile and banner images">
        <div className="space-y-4">
          <ImageUpload
            label="Banner image (recommended: 1200×300)"
            current={bannerImage}
            aspectClass="h-32 w-full"
            onUploaded={setBannerImage}
          />
          <ImageUpload
            label="Profile image"
            current={profileImage}
            aspectClass="h-24 w-24 rounded-full"
            onUploaded={setProfileImage}
          />
        </div>
      </Section>

      {/* Profile details */}
      <Section title="Profile details" sub="How you appear on your public storefront">
        <div className="space-y-4">
          <Input
            label="Display name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Adaeze Okonkwo"
          />

          <div>
            <label className="block text-xs text-[var(--muted)] mb-1.5 font-inter tracking-wide">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell buyers a bit about yourself and what you create..."
              rows={4}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-colors resize-none font-inter"
            />
          </div>

          {/* Store slug */}
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1.5 font-inter tracking-wide">
              Store URL
            </label>
            <div className="flex items-center gap-0 bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/20 transition-colors">
              <span className="px-4 py-3 text-sm text-white/20 font-inter border-r border-[var(--border)] whitespace-nowrap">
                creatorlock.com/store/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  setSlugStatus("idle");
                }}
                onBlur={handleSlugBlur}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none font-inter"
                placeholder="your-store"
              />

              {/* Slug status indicator */}
              <div className="px-3">
                {slugStatus === "checking" && (
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin inline-block" />
                )}
                {slugStatus === "available" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-400">
                    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {slugStatus === "taken" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-400">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </div>

            {/* Slug warnings */}
            <AnimatePresence>
              {slugChanged && slugStatus !== "taken" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-orange-400/80 font-inter mt-2 flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
          {[
            { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/yourhandle" },
            { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
            { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
            { key: "website", label: "Website", placeholder: "https://yourwebsite.com" },
          ].map(({ key, label, placeholder }) => (
            <Input
              key={key}
              label={label}
              type="url"
              value={social[key as keyof typeof social]}
              onChange={(e) =>
                setSocial((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={placeholder}
            />
          ))}
        </div>
      </Section>

      {/* Save button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
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