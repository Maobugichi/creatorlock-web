import type { Metadata } from 'next';
import { redeemToken } from '@/features/buyer/utils/redeemToken';
import DownloadError from '@/features/buyer/components/downloadError';
import DownloadSuccess from '@/features/buyer/components/downloadSuccess';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(_props: PageProps): Promise<Metadata> {
  return { title: 'Download — CreatorLock' };
}

export default async function DownloadPage({ params }: PageProps) {
  const { token } = await params;
  const result = await redeemToken(token);

  if (!result.ok) return <DownloadError expired={result.expired} />;

  return <DownloadSuccess token={token} logId={result.logId} downloads={result.downloads} />;
}