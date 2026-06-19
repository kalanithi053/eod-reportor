"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  /** Optional longer description shown below the message */
  description?: string;
  /** Auto-dismiss after N milliseconds. Omit to keep it persistent. */
  duration?: number;
  /** Called when the alert is dismissed (either by user or auto-dismiss) */
  onClose?: () => void;
  /** Show a close (×) button. Defaults to true. */
  dismissible?: boolean;
  className?: string;
}

const CONFIG: Record<
  AlertType,
  {
    Icon: React.ElementType;
    container: string;
    icon: string;
    title: string;
    desc: string;
    bar: string;
  }
> = {
  success: {
    Icon: CheckCircle2,
    container:
      "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300",
    icon: "text-emerald-400",
    title: "text-emerald-300",
    desc: "text-emerald-400/70",
    bar: "bg-emerald-500",
  },
  error: {
    Icon: AlertCircle,
    container: "bg-red-500/10 border border-red-500/30 text-red-300",
    icon: "text-red-400",
    title: "text-red-300",
    desc: "text-red-400/70",
    bar: "bg-red-500",
  },
  warning: {
    Icon: AlertTriangle,
    container: "bg-amber-500/10 border border-amber-500/30 text-amber-300",
    icon: "text-amber-400",
    title: "text-amber-300",
    desc: "text-amber-400/70",
    bar: "bg-amber-500",
  },
  info: {
    Icon: Info,
    container: "bg-blue-500/10 border border-blue-500/30 text-blue-300",
    icon: "text-blue-400",
    title: "text-blue-300",
    desc: "text-blue-400/70",
    bar: "bg-blue-500",
  },
};

export function Alert({
  type,
  message,
  description,
  duration,
  onClose,
  dismissible = true,
  className = "",
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    onClose?.();
  };

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  if (!visible) return null;

  const { Icon, container, icon, title, desc, bar } = CONFIG[type];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-lg px-4 py-3 text-sm overflow-hidden ${container} ${className}`}
    >
      {/* Left accent bar */}
      <span className={`absolute left-0 inset-y-0 w-1 rounded-l-lg ${bar}`} />

      <Icon size={16} className={`shrink-0 mt-0.5 ml-1 ${icon}`} />

      <div className="flex-1 min-w-0">
        <p className={`font-medium leading-snug ${title}`}>{message}</p>
        {description && (
          <p className={`mt-0.5 text-xs leading-relaxed ${desc}`}>
            {description}
          </p>
        )}
      </div>

      {dismissible && (
        <button
          onClick={dismiss}
          aria-label="Dismiss alert"
          className="shrink-0 mt-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* ─── Toast variant (fixed bottom-right) ───────────────────────────────────── */

interface ToastProps extends AlertProps {
  /** Stack position when multiple toasts are shown (0 = bottom) */
  index?: number;
}

export function Toast({ index = 0, ...props }: ToastProps) {
  return (
    <div
      className="fixed z-50 w-80 shadow-2xl"
      style={{
        bottom: `${1.5 + index * 5}rem`,
        right: "1.5rem",
      }}
    >
      <Alert {...props} />
    </div>
  );
}

/* ─── Convenience hook for imperative toasts ────────────────────────────────
   Usage:
     const { showAlert, AlertContainer } = useAlert();
     showAlert({ type: "success", message: "Saved!" });
     return <div>...<AlertContainer /></div>
────────────────────────────────────────────────────────────────────────────── */

interface AlertEntry extends AlertProps {
  id: number;
}

let _id = 0;

export function useAlert() {
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);

  const showAlert = (props: AlertProps) => {
    const id = ++_id;
    setAlerts((prev) => [...prev, { ...props, id }]);
    if (props.duration) {
      setTimeout(() => removeAlert(id), props.duration);
    }
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const AlertContainer = () => (
    <>
      {alerts.map((alert, i) => (
        <Toast
          key={alert.id}
          index={i}
          {...alert}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </>
  );

  return { showAlert, AlertContainer };
}
