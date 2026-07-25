'use client';

interface PreviewSectionProps {
  preview: {
    url: string;
    category: string | null;
  } | null;
}

export default function PreviewSection({ preview }: PreviewSectionProps) {
  if (!preview) return null;

  return (
    <div className="rounded-2xl border p-5" style={{ background: 'var(--color-surface)', borderColor: 'var(--border)' }}>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-brand)' }} />
        <h2 className="font-syne text-sm font-bold text-white">Preview</h2>
      </div>

      {preview.category === 'document' && (
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <iframe src={`${preview.url}#toolbar=0`} className="h-96 w-full" title="Preview" />
        </div>
      )}

      {preview.category === 'video' && (
        <video controls className="w-full rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <source src={preview.url} />
        </video>
      )}

      {preview.category === 'audio' && (
        <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: '#0C0C0C' }}>
          <audio controls className="w-full">
            <source src={preview.url} />
          </audio>
        </div>
      )}

      {preview.category === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview.url} alt="Product preview" className="w-full rounded-xl border" style={{ borderColor: 'var(--border)' }} />
      )}
    </div>
  );
}