"use client";

import { useRef, useState, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { formatFileSize } from "@/lib/utils";
import type { SelectedFile } from "../types/product.types";

interface FileDropZoneProps {
  files: SelectedFile[];
  onAdd: (incoming: File[]) => void;
  onRemove: (id: string) => void;
}

export default function FileDropZone({ files, onAdd, onRemove }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      if (dropped.length) onAdd(dropped);
    },
    [onAdd]
  );

  const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) onAdd(selected);
    e.target.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-inter text-white/70 mb-2">
        Digital files <span className="text-red-400">*</span>
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full rounded-xl border border-dashed transition-colors p-6 flex flex-col items-center gap-3 cursor-pointer ${
          isDragging
            ? "border-brand bg-brand/5"
            : "border-[var(--border)] hover:border-brand/40 bg-[var(--bg)]"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center">
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-inter text-white/60">
            <span className="text-brand">Browse files</span> or drag and drop
          </p>
          <p className="text-xs text-white/30 font-inter mt-1">
            PDF, ZIP, MP4, MP3, EPUB and more
          </p>
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleBrowse} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 bg-white/[0.03] border border-[var(--border)] rounded-xl px-4 py-3"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-inter truncate">{f.file.name}</p>
                <p className="text-xs text-white/30 font-mono">{formatFileSize(f.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(f.id); }}
                className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}