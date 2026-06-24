import api from '@/lib/api';

export function useExportBuyers() {
  const exportBuyers = async () => {
    const res = await api.get('/creator/buyers/export', {
      responseType: 'blob',
    });

    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buyers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportBuyers };
}