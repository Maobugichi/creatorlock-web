// components/ui/datePicker.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  name: string;
  minDate?: string; // ISO string, e.g. "2026-07-25"
  placeholder?: string;
}

export default function DatePicker({ name, minDate, placeholder = 'Select date' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const min = minDate ? new Date(`${minDate}T00:00:00`) : null;

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isDisabled = (day: number) => {
    if (!min) return false;
    return new Date(viewDate.getFullYear(), viewDate.getMonth(), day) < min;
  };

  const isSelected = (day: number) =>
    !!selected &&
    selected.getFullYear() === viewDate.getFullYear() &&
    selected.getMonth() === viewDate.getMonth() &&
    selected.getDate() === day;

  const handleSelect = (day: number) => {
    setSelected(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    setOpen(false);
  };

  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const displayLabel = selected
    ? selected.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : placeholder;

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <input type="hidden" name={name} value={selected ? toISO(selected) : ''} />

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-left transition-colors focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 ${
          selected ? 'text-white' : 'text-[var(--muted)]'
        }`}
      >
        <span>{displayLabel}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-[var(--muted)]">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 bottom-full mb-2 left-0 w-72 rounded-2xl border p-4 shadow-xl"
          style={{ background: '#111', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-white hover:bg-white/5 transition-colors"
            >
              ‹
            </button>
            <span className="text-sm font-syne font-semibold text-white">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-white hover:bg-white/5 transition-colors"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[10px] text-[var(--muted)] text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDisabled(day);
              const active = isSelected(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className={`w-8 h-8 rounded-lg text-xs font-inter transition-colors ${
                    active
                      ? 'bg-brand text-white font-semibold'
                      : disabled
                      ? 'text-white/15 cursor-not-allowed'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {selected && (
            <button
              type="button"
              onClick={() => { setSelected(null); setOpen(false); }}
              className="mt-3 w-full text-center text-xs text-[var(--muted)] hover:text-white transition-colors"
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}