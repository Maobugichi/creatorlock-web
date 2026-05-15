"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("thumbnail", file);
  const { data } = await api.post<{ url: string }>("/creator/upload-image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

interface ImageUploadProps {
  label: string;
  current: string | null;
  aspectClass: string;
  onUploaded: (url: string) => void;
}

export function ImageUpload({ label, current, aspectClass, onUploaded }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [blobPreview, setBlobPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const preview = blobPreview ?? current;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBlobPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onUploaded(url);
      setBlobPreview(null);
    } catch {
      setBlobPreview(null);
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
          aspectClass,
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/20">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="17 8 12 3 7 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
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