'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BuyerProfile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

interface ApiError {
  response?: { data?: { message?: string } };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-white/[0.06] rounded-lg w-1/3" />
      <div className="h-3 bg-white/[0.03] rounded-lg w-1/4" />
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="space-y-1.5 animate-pulse">
      <div className="h-3 bg-white/[0.06] rounded w-16" />
      <div className="h-10 bg-white/[0.03] rounded-xl" />
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, email }: { name: string | null; email: string }) {
  const initial = (name ?? email).charAt(0).toUpperCase();
  return (
    <div className="w-14 h-14 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center flex-shrink-0">
      <span className="font-syne font-extrabold text-xl text-brand">{initial}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerSettingsPage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<BuyerProfile>({
    queryKey: ['buyer', 'profile'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BuyerProfile }>('/buyer/profile');
      return res.data.data;
    },
  });

  const {
    mutate: save,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: async (fields: { name?: string; email?: string }) => {
      const res = await api.patch<{ success: boolean; data: BuyerProfile }>(
        '/buyer/profile',
        fields
      );
      return res.data.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['buyer', 'profile'], updated);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();

    const form = e.currentTarget;
    const data = new FormData(form);

    const name  = (data.get('name')  as string).trim();
    const email = (data.get('email') as string).trim();

    // Only send changed fields
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

  const errorMessage = (error as ApiError)?.response?.data?.message ?? 'Something went wrong. Try again.';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-syne font-extrabold text-white">Settings</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage your account details.
        </p>
      </div>

      {/* Profile summary card */}
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] animate-pulse flex-shrink-0" />
          ) : profile ? (
            <Avatar name={profile.name} email={profile.email} />
          ) : null}

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <ProfileSkeleton />
            ) : profile ? (
              <>
                <p className="font-syne font-bold text-white truncate">
                  {profile.name ?? 'No name set'}
                </p>
                <p className="text-sm font-mono text-[var(--muted)] truncate mt-0.5">
                  {profile.email}
                </p>
                {memberSince && (
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Member since {memberSince}
                  </p>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-surface border border-[var(--border)] rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="font-syne font-bold text-lg text-white">Account details</h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Only changed fields will be saved.
          </p>
        </div>

        {/* Feedback banners */}
        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3.5 text-sm text-green-400 flex items-center gap-2.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully.
          </div>
        )}

        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3.5 text-sm text-red-400">
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
            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs text-[var(--muted)] uppercase tracking-widest block"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={profile?.name ?? ''}
                placeholder="Your name"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs text-[var(--muted)] uppercase tracking-widest block"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={profile?.email ?? ''}
                placeholder="you@example.com"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-colors"
              />
            </div>

            {/* Password hint */}
            <div className="bg-white/[0.03] border border-[var(--border)] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-inter text-white/60">Password</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Use the forgot password flow to update your password.
                </p>
              </div>
              <a
                href="/forgot-password"
                className="text-xs text-brand hover:text-brand-dark font-syne font-semibold flex-shrink-0 transition-colors"
              >
                Reset →
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                'Save changes'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}