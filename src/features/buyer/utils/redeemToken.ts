import { cache } from 'react';
import api from '@/lib/api';
import type { DownloadResponse, DownloadResult } from '@/features/buyer/types/buyer.types';

export const redeemToken = cache(async (token: string): Promise<DownloadResult> => {
  try {
    const res = await api.get<DownloadResponse>(`/download/${token}`);
    return { ok: true, logId: res.data.data.logId, downloads: res.data.data.downloads };
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    return { ok: false, expired: status !== 404 };
  }
});