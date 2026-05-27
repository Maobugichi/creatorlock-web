import { LibraryList } from './_components/library-list';

export const metadata = {
  title: 'My Library | Creatorlock',
};

export default function LibraryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-syne font-extrabold">My Library</h1>
        <p className="text-sm text-[var(--muted)] mt-1">All your purchased products and download links.</p>
      </div>

      <LibraryList />
    </div>
  );
}