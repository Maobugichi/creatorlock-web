"use client";

import { formatFileSize } from "@/lib/utils";
import type { ProductFile } from "../types/product.types";

interface ExistingFileListProps {
  files: ProductFile[];
  onDelete: (fileId: string) => void;
  isDeleting: boolean;
}

export default function ExistingFileList({ files, onDelete, isDeleting }: ExistingFileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className="space-y-2 mb-3">
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
            <p className="text-sm text-white font-inter truncate">
              {f.original_name ?? f.public_id}
            </p>
            <p className="text-xs text-white/30 font-mono">
              {f.size ? formatFileSize(f.size) : "Unknown size"}
              {f.category && <span className="ml-2 opacity-60">{f.category}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/30 hover:text-brand transition-colors"
              title="View file"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(f.id)}
              className="text-white/30 hover:text-red-400 disabled:opacity-40 transition-colors"
              title="Remove file"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}