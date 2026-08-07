"use client";

import { useRef } from "react";

interface ThumbnailUploadProps {
  preview: string | null;
  onChange: (file: File) => void;
  currentUrl?: string;
  showSizeHint?: boolean;
}

export default function ThumbnailUpload({ preview, onChange, currentUrl, showSizeHint }: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const display = preview ?? currentUrl ?? null;

  return (
    <div>
      <label className="block text-sm font-inter text-surface-foreground/70 mb-2">
        Thumbnail <span className="text-muted-foreground">(optional)</span>
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-40 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors bg-elevated flex items-center justify-center overflow-hidden group"
      >
        {display ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={display}
              alt="Thumbnail preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              <span className="text-white text-xs font-inter">Change image</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-xs font-inter">Click to upload thumbnail</span>
          </div>
        )}
      </button>
      {showSizeHint && (
        <p className="mt-1.5 text-xs text-muted-foreground font-inter">
          JPG, PNG, WebP or GIF · Max 10MB
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}