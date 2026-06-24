import type { ProductFile } from '@/types/store';
import { formatFileSize } from '@/lib/utils';

interface FileRowProps {
  file: ProductFile;
}

export default function FileRow({ file }: FileRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ color: 'var(--muted)' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="truncate font-inter text-sm text-white/80">
          {file.original_name ?? file.url.split('/').pop() ?? 'File'}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {file.format && (
          <span className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            {file.format}
          </span>
        )}
        {file.size !== null && (
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
            {formatFileSize(file.size)}
          </span>
        )}
      </div>
    </div>
  );
}