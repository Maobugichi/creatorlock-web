import type { DownloadFile } from '@/features/buyer/types/buyer.types';

interface DownloadSuccessProps {
  downloads: DownloadFile[];
}

export default function DownloadSuccess({ downloads }: DownloadSuccessProps) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-syne font-extrabold">Your download is ready</h1>
            <p className="text-[var(--muted)] text-sm mt-1">
              Click below to download your file{downloads.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] uppercase tracking-widest">
              {downloads.length} {downloads.length === 1 ? 'file' : 'files'} ready to download
            </p>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {downloads.map((file, index) => (
              <li key={index} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-white truncate">{file.filename ?? 'Download'}</p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.filename ?? true}
                  className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark active:scale-[0.98] text-white text-sm font-syne font-semibold rounded-xl px-4 py-2 transition-all duration-150 shrink-0"
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

        <div className="flex items-start gap-3 bg-surface border border-[var(--border)] rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-[var(--muted)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            A copy of this download link was sent to your email. Links are time-limited — download your files now.
          </p>
        </div>
      </div>
    </main>
  );
}