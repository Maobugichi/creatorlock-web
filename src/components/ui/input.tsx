import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-white/40 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 focus:bg-brand/[0.02] transition-colors",
          className
        )}
        {...props}
      />
    </div>
  );
}