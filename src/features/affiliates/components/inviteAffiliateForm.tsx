'use client';

import { useRef, useState } from 'react';
import { useInviteAffiliate } from '../../creator/api/useInviteAffiliate';

export function InviteAffiliateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const { inviteAffiliate, isPending, inviteError } = useInviteAffiliate({
    onSuccess: () => {
      formRef.current?.reset();
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    },
  });

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setInviteSuccess(false);

    const formData = new FormData(e.currentTarget);
    const affiliate_email = (formData.get('affiliate_email') as string)?.trim();
    const commission_percent = Number(formData.get('commission_percent') ?? 10);

    if (!affiliate_email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(affiliate_email)) return;

    inviteAffiliate({ affiliate_email, commission_percent });
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h2 className="text-surface-foreground font-syne font-bold text-base mb-1">Add an Affiliate</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Enter the email address of the person you want to add as an affiliate, and set their
        commission rate.
      </p>

      {inviteError && (
        <div className="bg-status-exception/10 border border-status-exception/20 text-status-exception rounded-xl px-4 py-3 text-sm mb-4">
          {inviteError}
        </div>
      )}

      {inviteSuccess && (
        <div className="bg-status-positive/10 border border-status-positive/20 text-status-positive rounded-xl px-4 py-3 text-sm mb-4">
          Affiliate added successfully!
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
        <input
          name="affiliate_email"
          type="email"
          placeholder="affiliate@example.com"
          className="flex-1 bg-elevated border border-border rounded-xl px-4 py-3 text-surface-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
        <input
          name="commission_percent"
          type="number"
          min={1}
          max={90}
          defaultValue={10}
          placeholder="Commission %"
          className="w-full sm:w-32 bg-elevated border border-border rounded-xl px-4 py-3 text-surface-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-syne font-semibold rounded-xl px-5 py-3 text-sm transition-all shrink-0"
        >
          {isPending && (
            <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          )}
          {isPending ? 'Adding…' : 'Add Affiliate'}
        </button>
      </form>
    </div>
  );
}