export default function EditProductSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
      ))}
    </div>
  );
}