// src/app/(public)/download/[token]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import api from '@/lib/api';

interface DownloadFile {
  name: string;
  url: string;
  size_bytes?: number;
}

interface DownloadResponse {
  files: DownloadFile[];
  product_title: string;
  creator_name: string;
  creator_slug: string;
}

interface PageProps {
  params: { token: string };
}

type DownloadResult =
  | { ok: true; data: DownloadResponse }
  | { ok: false; expired: boolean };

async function redeemToken(token: string): Promise<DownloadResult> {
  try {
    const res = await api.get<DownloadResponse>(`/download/${token}`);
    return { ok: true, data: res.data };
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    // 400/403/410 = expired or invalid; 404 = not found at all
    return { ok: false, expired: status !== 404 };
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await redeemToken(params.token);
  if (!result.ok) return { title: 'Download — CreatorLock' };
  return {
    title: `Download ${result.data.product_title} — CreatorLock`,
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const result = await redeemToken(params.token);

  // Error state
  if (!result.ok) {
    return (
      <main className="min-h-screen bg-[var(--bg)] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-syne font-extrabold">
              {result.expired ? 'Link expired' : 'Link not found'}
            </h1>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {result.expired
                ? 'This download link has expired or already been used. Check your email for a new link, or contact the creator.'
                : 'This download link doesn\'t exist. Double-check your email for the correct link.'}
            </p>
          </div>

          <div className="bg-surface border border-[var(--border)] rounded-2xl p-5 text-left space-y-3">
            <p className="text-sm font-syne font-semibold">What you can do</p>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Check your inbox and spam folder for the original download email
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Log in to your library to resend the download link
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-block bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-syne font-semibold rounded-xl py-3 px-8 transition-all duration-150"
          >
            Back to CreatorLock
          </Link>
        </div>
      </main>
    );
  }

  const { data } = result;

  return (
    <main className="min-h-screen bg-[var(--bg)] text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Success header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-syne font-extrabold">{data.product_title}</h1>
            <p className="text-[var(--muted)] text-sm mt-1">
              by{' '}
              <Link
                href={`/store/${data.creator_slug}`}
                className="text-white hover:text-brand transition-colors"
              >
                {data.creator_name}
              </Link>
            </p>
          </div>
        </div>

        {/* File list */}
        <div className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] uppercase tracking-widest">
              {data.files.length} {data.files.length === 1 ? 'file' : 'files'} ready to download
            </p>
          </div>

          <ul className="divide-y divide-[var(--border)]">
            {data.files.map((file, index) => (
              <li key={index} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    {file.size_bytes !== undefined && (
                      <p className="text-xs text-[var(--muted)]">{formatBytes(file.size_bytes)}</p>
                    )}
                  </div>
                </div>

                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark active:scale-[0.98] text-white text-sm font-syne font-semibold rounded-xl px-4 py-2 transition-all duration-150 shrink-0"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Note */}
        <div className="flex items-start gap-3 bg-surface border border-[var(--border)] rounded-xl px-4 py-3">
          <svg
            className="w-4 h-4 text-[var(--muted)] mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            A copy of this download link was also sent to your email. Links are time-limited — download your files now.
          </p>
        </div>

        {/* Back link */}
        <p className="text-center text-sm text-[var(--muted)]">
          Want more?{' '}
          <Link
            href={`/store/${data.creator_slug}`}
            className="text-white hover:text-brand transition-colors"
          >
            Visit {data.creator_name}&apos;s store →
          </Link>
        </p>
      </div>
    </main>
  );
}