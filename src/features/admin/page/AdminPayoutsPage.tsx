'use client';

import { useState } from 'react';
import { CreatorPayoutsTab } from '../component/CreatorPayoutsTab';
import { AffiliatePayoutsTab } from '../component/AffiliatePayoutsTab';

type Tab = 'creator' | 'affiliate';

export default function AdminPayoutsPage() {
  const [tab, setTab] = useState<Tab>('creator');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-syne font-extrabold text-2xl">Payouts</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Review and process pending payout requests.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        <button
          onClick={() => setTab('creator')}
          className={`text-sm font-syne font-semibold px-4 py-2.5 border-b-2 transition-colors ${
            tab === 'creator' ? 'text-white border-brand' : 'text-[var(--muted)] border-transparent hover:text-white'
          }`}
        >
          Creator Payouts
        </button>
        <button
          onClick={() => setTab('affiliate')}
          className={`text-sm font-syne font-semibold px-4 py-2.5 border-b-2 transition-colors ${
            tab === 'affiliate' ? 'text-white border-brand' : 'text-[var(--muted)] border-transparent hover:text-white'
          }`}
        >
          Affiliate Payouts
        </button>
      </div>

      {tab === 'creator' ? <CreatorPayoutsTab /> : <AffiliatePayoutsTab />}
    </div>
  );
}