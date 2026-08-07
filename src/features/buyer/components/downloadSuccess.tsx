'use client';

import type { DownloadFile } from '@/features/buyer/types/buyer.types';

interface DownloadSuccessProps {
  token: string;
  logId: string;
  downloads: DownloadFile[];
}

export default function DownloadSuccess({ token, logId, downloads }: DownloadSuccessProps) {
  const handleDownloadClick = () => {
    fetch('/api/download/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, logId }),
      keepalive: true,
    }).catch(() => {
      // Fire-and-forget: a failed confirm ping shouldn't block or
      // interrupt the buyer's actual file download.
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-status-positive/10 border border-status-positive/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-status-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-syne font-extrabold">Your download is ready</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Click below to download your file{downloads.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              {downloads.length} {downloads.length === 1 ? 'file' : 'files'} ready to download
            </p>
          </div>
          <ul className="divide-y divide-border">
            {downloads.map((file, index) => (
              <li key={index} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-surface-foreground truncate">{file.filename ?? 'Download'}</p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.filename ?? true}
                  onClick={handleDownloadClick}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground text-sm font-syne font-semibold rounded-xl px-4 py-2 transition-all duration-150 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-3 bg-surface border border-border rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A copy of this download link was sent to your email. Links are time-limited — download your files now.
          </p>
        </div>
      </div>
    </main>
  );
}