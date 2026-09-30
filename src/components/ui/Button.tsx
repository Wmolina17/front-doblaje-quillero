import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost" | "success" | "danger" | "dark";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  gold: "bg-gold-gradient text-on-gold shadow-gold hover:brightness-110",
  outline: "border border-gold-500/50 text-gold-300 hover:bg-gold-500/10",
  ghost: "text-ink-100 hover:bg-white/5",
  success: "bg-success text-white hover:bg-green-600",
  danger: "bg-danger text-white hover:bg-red-600",
  dark: "bg-ink-600 text-ink-50 border border-ink-400 hover:bg-ink-500",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2",
};

export default function Button({
  variant = "gold",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}
      {children}
    </button>
  );
}
