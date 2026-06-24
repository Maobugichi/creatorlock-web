import {
  Globe,
  FileDashed,
  EyeSlash,
  Warning,
} from "@phosphor-icons/react";
import type { ProductStatus } from "../types/product.types";

// ─── Config ───────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  ProductStatus,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  published: {
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Published",
  },
  draft: {
    icon: FileDashed,
    color: "text-white/40",
    bg: "bg-white/[0.05]",
    border: "border-white/10",
    label: "Draft",
  },
  unpublished: {
    icon: EyeSlash,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Unpublished",
  },
  flagged: {
    icon: Warning,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Flagged",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StatusBadge({ status }: { status: ProductStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border ${config.color} ${config.bg} ${config.border}`}
      title={config.label}
    >
      <Icon size={11} weight="bold" />
    </span>
  );
}