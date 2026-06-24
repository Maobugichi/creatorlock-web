export function formatStat(value: number): { display: string; full: string } {
  const full = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(value);

  let display: string;

  if (value >= 1_000_000_000) {
    display = `₦${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  } else if (value >= 1_000_000) {
    display = `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  } else if (value >= 1_000) {
    display = `₦${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  } else {
    display = `₦${value.toLocaleString('en-NG')}`;
  }

  return { display, full };
}