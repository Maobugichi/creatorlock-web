import {
  Globe,
  FileDashed,
  EyeSlash,
  Warning,
} from "@phosphor-icons/react";
import type { ProductStatus } from "../types/product.types";

export const STATUS_CONFIG: Record<
  ProductStatus,
  { icon: React.ElementType; color: string; bg: string; border: string; label: string }
> = {
  published: {
    icon: Globe,
    color: "text-status-positive",
    bg: "bg-status-positive/10",
    border: "border-status-positive/20",
    label: "Published",
  },
  draft: {
    icon: FileDashed,
    color: "text-muted-foreground",
    bg: "bg-elevated",
    border: "border-border",
    label: "Draft",
  },
  unpublished: {
    icon: EyeSlash,
    color: "text-status-warning",
    bg: "bg-status-warning/10",
    border: "border-status-warning/20",
    label: "Unpublished",
  },
  flagged: {
    icon: Warning,
    color: "text-status-exception",
    bg: "bg-status-exception/10",
    border: "border-status-exception/20",
    label: "Flagged",
  },
};

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