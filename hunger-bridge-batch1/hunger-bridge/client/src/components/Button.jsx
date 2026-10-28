import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  type = "button",
  className = "",
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
