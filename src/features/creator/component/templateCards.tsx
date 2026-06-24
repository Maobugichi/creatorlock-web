'use client';

import type { EmailTemplate } from '../types/buyerEmailDrawer.types';

interface TemplateCardProps {
  template: EmailTemplate;
  selected: boolean;
  onSelect: () => void;
}

export function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border border-gray-600  hover:border-brand/25 hover:bg-brand/20 transition-all active:scale-[0.98] ${
        selected
          ? 'border-brand/50 bg-brand/7'
          : 'border-(--border) bg-surface'
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 text-sm">
        {template.icon}
      </div>
      <div className="min-w-0">
        <p className="text-white text-xs font-syne font-bold mb-0.5">{template.label}</p>
        <p className="text-(--muted) text-xs font-inter leading-relaxed">{template.description}</p>
      </div>
    </button>
  );
}