interface EditProductErrorProps {
  onBack: () => void;
}

export default function EditProductError({ onBack }: EditProductErrorProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <p className="text-[var(--muted)] font-inter text-sm">
        Product not found or you don&#39;t have access.
      </p>
      <button
        onClick={onBack}
        className="mt-4 text-brand hover:underline font-inter text-sm"
      >
        Back to products
      </button>
    </div>
  );
}