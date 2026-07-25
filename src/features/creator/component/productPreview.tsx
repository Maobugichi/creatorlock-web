"use client";

import { useRef, useState, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { formatFileSize } from "@/lib/utils";

interface PreviewUploadProps {
  file: File | null;
  onChange: (file: File) => void;
  onRemove: () => void;
}

export default function PreviewUpload({ file, onChange, onRemove }: PreviewUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onChange(dropped);
    },
    [onChange]
  );

  const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onChange(selected);
    e.target.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-inter text-white/70 mb-2">
        Preview <span className="text-white/30">(optional)</span>
      </label>

      <div className="flex items-center gap-2 bg-brand/[0.06] border border-brand/20 rounded-xl px-3 py-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
        <p className="text-[11px] text-white/60 font-inter">
          Products with a preview build more buyer confidence
        </p>
      </div>

      {file ? (
        <div className="flex items-center gap-3 bg-white/[0.03] border border-[var(--border)] rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-inter truncate">{file.name}</p>
            <p className="text-xs text-white/30 font-mono">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full rounded-xl border border-dashed transition-colors p-5 flex flex-col items-center gap-2 cursor-pointer ${
            isDragging
              ? "border-brand bg-brand/5"
              : "border-[var(--border)] hover:border-brand/40 bg-[var(--bg)]"
          }`}
        >
          <p className="text-sm font-inter text-white/60">
            <span className="text-brand">Browse</span> or drag a preview file
          </p>
          <p className="text-xs text-white/30 font-inter">
            e.g. a sample chapter, a short clip, or a demo — buyers see exactly what you upload
          </p>
          <input ref={inputRef} type="file" className="hidden" onChange={handleBrowse} />
        </div>
      )}
    </div>
  );
}