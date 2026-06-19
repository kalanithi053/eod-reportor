"use client";

import { AlertTriangle, Info, LogOut, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;

  title: string;
  description?: string;
  variant?: ConfirmVariant;

  confirmLabel?: string;
  cancelLabel?: string;

  /** Optional lucide icon to override the default per-variant icon */
  icon?: React.ReactNode;
}

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  {
    iconBg: string;
    iconColor: string;
    Icon: React.ElementType;
    confirmBtn: string;
  }
> = {
  danger: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    Icon: LogOut,
    confirmBtn:
      "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-red-900/30",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    Icon: AlertTriangle,
    confirmBtn:
      "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-zinc-950 shadow-amber-900/30",
  },
  info: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    Icon: Info,
    confirmBtn:
      "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-blue-900/30",
  },
};

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  variant = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel by default (safe pattern)
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const { iconBg, iconColor, Icon, confirmBtn } = VARIANT_CONFIG[variant];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby={description ? "confirm-desc" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-6 flex flex-col gap-5">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Icon + text */}
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon ?? <Icon size={18} className={iconColor} />}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p
              id="confirm-title"
              className="text-sm font-semibold text-zinc-100 leading-snug"
            >
              {title}
            </p>
            {description && (
              <p
                id="confirm-desc"
                className="mt-1 text-xs text-zinc-500 leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800" />

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-lg ${confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
