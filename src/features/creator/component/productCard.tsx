"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PencilSimple } from "@phosphor-icons/react";
import { ConfirmPopover } from "@/app/(dashboard)/products/_components/ConfirmPopup";
import StatusBadge from "./productStatusBadge";
import { formatNGN, formatRelativeTime } from "../utils/product.utils";
import type { Product, ProductStatus } from "../types/product.types";

// ─── NOTE: ConfirmPopover is imported from its current location in
// app/(dashboard)/products/_components/ConfirmPopup.tsx
// This is a shared-component candidate flagged in §9 of the handoff doc.
// Move it to features/dashboard/shared/components/ when that question is resolved.

interface ProductCardProps {
  product: Product;
  onToggle: (id: string, currentStatus: ProductStatus) => void;
  isToggling: boolean;
}

export default function ProductCard({ product, onToggle, isToggling }: ProductCardProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const canToggle =
    product.status === "published" ||
    product.status === "draft" ||
    product.status === "unpublished";

  const isPublished = product.status === "published";
  const pendingAction: "publish" | "unpublish" = isPublished ? "unpublish" : "publish";

  function handleToggleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isToggling && canToggle) setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    onToggle(product.id, product.status);
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  return (
    <div
      className="bg-surface border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-colors group"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* Thumbnail */}
      <div className="h-36 bg-[var(--bg)] flex items-center justify-center overflow-hidden relative">
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-syne font-extrabold text-white/10 select-none">
            {product.title.charAt(0).toUpperCase()}
          </span>
        )}

        <Link
          href={`/products/${product.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/80 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Edit product"
        >
          <PencilSimple size={12} weight="bold" />
        </Link>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-syne font-bold text-white text-sm leading-snug line-clamp-1 mb-1 group-hover:text-brand transition-colors">
          {product.title}
        </h3>

        <p className="font-mono text-[10px] text-white/30 mb-3 truncate">
          {formatNGN(product.price_cents)}
          {product.updated_at && (
            <span className="text-white/20"> · {formatRelativeTime(product.updated_at)}</span>
          )}
        </p>

        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={product.status} />

          {canToggle && (
            <div className="relative shrink-0">
              <button
                onClick={handleToggleClick}
                disabled={isToggling}
                className={`flex items-center justify-center gap-1.5 px-2.5 h-7 rounded-lg border text-[10px] font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPublished
                    ? "border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                {isToggling ? (
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : isPublished ? "Unlist" : "List"}
              </button>

              {showConfirm && (
                <ConfirmPopover
                  action={pendingAction}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}