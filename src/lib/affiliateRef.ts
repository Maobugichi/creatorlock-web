// src/lib/affiliateRef.ts

const STORAGE_KEY = 'cl_ref';
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; 

export const saveAffiliateRef = (code: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      code,
      expires: Date.now() + EXPIRY_MS,
    }));
  } catch {}
};

export const getAffiliateRef = (): string | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { code, expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return code;
  } catch {
    return null;
  }
};

export const clearAffiliateRef = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
};