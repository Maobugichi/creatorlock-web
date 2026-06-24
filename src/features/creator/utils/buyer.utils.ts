import type { BuyerRow } from '../types/buyer.types';

export const extractBuyers = (d: unknown): BuyerRow[] => {
  if (Array.isArray(d)) return d;
  if (d && typeof d === 'object') {
    const obj = d as Record<string, unknown>;
    if (Array.isArray(obj.buyers)) return obj.buyers as BuyerRow[];
    if (Array.isArray(obj.data)) return obj.data as BuyerRow[];
  }
  return [];
};