import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-muted-foreground mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-surface-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-primary/[0.02] transition-colors",
          className
        )}
        {...props}
      />
    </div>
  );
}