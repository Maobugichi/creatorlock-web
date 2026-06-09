import { useEffect, useRef, useState } from "react";

interface ConfirmPopoverProps {
  action: "publish" | "unpublish";
  onConfirm: () => void;
  onCancel: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" 
      ? window.matchMedia("(max-width: 640px)").matches 
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

// ─── Shared confirm content ───────────────────────────────────────────────────

function ConfirmContent({
  action,
  onConfirm,
  onCancel,
}: ConfirmPopoverProps) {
  const isUnpublish = action === "unpublish";
  return (
    <>
      <p className="font-inter text-white/70 text-xs mb-3 leading-relaxed">
        {isUnpublish
          ? "This will hide the product from your store. Confirm?"
          : "This will make the product visible in your store. Confirm?"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white/70 text-xs font-inter transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-1.5 rounded-lg text-xs font-syne font-semibold transition-colors ${
            isUnpublish
              ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
              : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
          }`}
        >
          {isUnpublish ? "Unpublish" : "Publish"}
        </button>
      </div>
    </>
  );
}


function DesktopPopover({ action, onConfirm, onCancel }: ConfirmPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onCancel]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full right-0 mb-2 z-20 w-48 bg-[#111] border border-white/10 rounded-xl p-3 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Arrow */}
      <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-[#111] border-r border-b border-white/10 rotate-45" />
      <ConfirmContent action={action} onConfirm={onConfirm} onCancel={onCancel} />
    </div>
  );
}

// ─── Mobile: bottom sheet ─────────────────────────────────────────────────────

function MobileBottomSheet({ action, onConfirm, onCancel }: ConfirmPopoverProps) {
  const isUnpublish = action === "unpublish";

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      {/* Sheet */}
      <div
        className="w-full bg-[#111] border-t border-white/10 rounded-t-2xl px-5 pt-5 pb-8 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5" />

        <p className="font-syne font-bold text-white text-base mb-1">
          {isUnpublish ? "Unpublish product?" : "Publish product?"}
        </p>
        <p className="font-inter text-white/40 text-sm mb-6 leading-relaxed">
          {isUnpublish
            ? "This will hide the product from your store. Buyers won't be able to purchase it."
            : "This will make your product visible and purchasable in your store."}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className={`w-full py-3.5 rounded-xl text-sm font-syne font-semibold transition-colors ${
              isUnpublish
                ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/20"
                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
            }`}
          >
            {isUnpublish ? "Yes, unpublish" : "Yes, publish"}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 rounded-xl text-sm font-inter text-white/40 hover:text-white/70 border border-white/[0.07] bg-white/[0.03] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Exported: switches based on screen size ──────────────────────────────────

export function ConfirmPopover(props: ConfirmPopoverProps) {
  const isMobile = useIsMobile();
  return isMobile
    ? <MobileBottomSheet {...props} />
    : <DesktopPopover {...props} />;
}