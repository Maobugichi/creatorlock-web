"use client";

import { useBuyerProfile, useUpdateBuyerProfile } from "@/features/buyer/api/useBuyerProfile";
import BuyerAvatar from "@/features/buyer/components/buyerAvatar";
import { ProfileSkeleton, FieldSkeleton } from "@/features/buyer/components/profileSkeletons";
import { BecomeCreatorCard } from "../components/becomeCreatorCard";

export default function ProfilePage() {
  const { data: profile, isLoading } = useBuyerProfile();

  const {
    mutate: save,
    isPending,
    isSuccess,
    isError,
    errorMessage,
    reset,
  } = useUpdateBuyerProfile();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();

    const form = e.currentTarget;
    const data = new FormData(form);

    const name  = (data.get('name')  as string).trim();
    const email = (data.get('email') as string).trim();

    const fields: { name?: string; email?: string } = {};
    if (name  && name  !== (profile?.name  ?? '')) fields.name  = name;
    if (email && email !== (profile?.email ?? '')) fields.email = email;

    if (Object.keys(fields).length === 0) return;

    save(fields);
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      <div>
        <h1 className="text-2xl font-syne font-extrabold text-surface-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-14 h-14 rounded-2xl bg-elevated animate-pulse flex-shrink-0" />
          ) : profile ? (
            <BuyerAvatar name={profile.name} email={profile.email} />
          ) : null}

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <ProfileSkeleton />
            ) : profile ? (
              <>
                <p className="font-syne font-bold text-surface-foreground truncate">
                  {profile.name ?? 'No name set'}
                </p>
                <p className="text-sm font-mono text-muted-foreground truncate mt-0.5">
                  {profile.email}
                </p>
                {memberSince && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {memberSince}
                  </p>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="font-syne font-bold text-lg text-surface-foreground">Account details</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Only changed fields will be saved.</p>
        </div>

        {isSuccess && (
          <div className="bg-status-positive/10 border border-status-positive/20 rounded-xl px-5 py-3.5 text-sm text-status-positive flex items-center gap-2.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully.
          </div>
        )}

        {isError && (
          <div className="bg-status-exception/10 border border-status-exception/20 rounded-xl px-5 py-3.5 text-sm text-status-exception">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs text-muted-foreground uppercase tracking-widest block">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={profile?.name ?? ''}
                placeholder="Your name"
                className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-surface-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-widest block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={profile?.email ?? ''}
                placeholder="you@example.com"
                className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-surface-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="bg-elevated border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-inter text-surface-foreground/70">Password</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use the forgot password flow to update your password.
                </p>
              </div>
              <a
                href="/forgot-password"
                className="text-xs text-primary hover:text-primary-dark font-syne font-semibold flex-shrink-0 transition-colors"
              >
                Reset →
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                'Save changes'
              )}
            </button>
          </form>
        )}
      </div>
      <BecomeCreatorCard />
    </div>
  );
}