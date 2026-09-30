import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ withLabel = false, className = "" }: { withLabel?: boolean; className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Modo claro" : "Modo oscuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={
        withLabel
          ? `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-100 transition hover:bg-gold-500/10 ${className}`
          : `inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/30 bg-ink-800 text-gold-300 transition hover:bg-gold-500/10 ${className}`
      }
    >
      {theme === "dark" ? <FiSun size={withLabel ? 18 : 16} /> : <FiMoon size={withLabel ? 18 : 16} />}
      {withLabel && label}
    </button>
  );
}
