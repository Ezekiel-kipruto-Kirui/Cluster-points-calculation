type AlertTone = "danger" | "warning" | "success" | "info";

const toneClass: Record<AlertTone, string> = {
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-slate-200 bg-slate-50 text-slate-700",
};

type AlertMessageProps = {
  message?: string;
  tone?: AlertTone;
  className?: string;
};

export default function AlertMessage({ message, tone = "info", className = "" }: AlertMessageProps) {
  if (!message) return null;
  return (
    <p className={`rounded-lg border px-3 py-2 text-sm ${toneClass[tone] || toneClass.info} ${className}`}>{message}</p>
  );
}

