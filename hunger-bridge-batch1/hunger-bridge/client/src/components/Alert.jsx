import { AlertCircle, CheckCircle2 } from "lucide-react";

const STYLES = {
  error: "bg-clay/10 text-clay border-clay/30",
  success: "bg-bridge-50 text-bridge-700 border-bridge-200",
};

export default function Alert({ type = "error", children }) {
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={`flex items-start gap-2 rounded border px-4 py-3 text-sm ${STYLES[type]}`} role="alert">
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
