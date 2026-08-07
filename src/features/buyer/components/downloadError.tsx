import Link from 'next/link';

interface DownloadErrorProps {
  expired: boolean;
}

export default function DownloadError({ expired }: DownloadErrorProps) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-status-exception/10 border border-status-exception/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-status-exception" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-syne font-extrabold">
            {expired ? 'Link expired' : 'Link not found'}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {expired
              ? 'This download link has expired or already been used. Check your email for a new link, or contact the creator.'
              : "This download link doesn't exist. Double-check your email for the correct link."}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 text-left space-y-3">
          <p className="text-sm font-syne font-semibold">What you can do</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Check your inbox and spam folder for the original download email
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Log in to your library to resend the download link
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="inline-block bg-primary hover:bg-primary-dark active:scale-[0.98] text-primary-foreground font-syne font-semibold rounded-xl py-3 px-8 transition-all duration-150"
        >
          Back to CreatorLock
        </Link>
      </div>
    </main>
  );
}