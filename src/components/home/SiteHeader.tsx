import { FiSearch } from "react-icons/fi";
import { useSettings } from "@/context/SettingsContext";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SiteHeader({ onConsult }: { onConsult: () => void }) {
  const { settings } = useSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/15 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <a href="#inicio" className="flex min-w-0 items-center gap-3">
          <Logo size={44} />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-2xl tracking-wide text-gold-gradient">{settings.siteName}</p>
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-ink-200">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
              Eventos oficiales
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink-100 lg:flex">
          <a href="#premios" className="transition hover:text-gold-300">Premios</a>
          <a href="#como-participar" className="transition hover:text-gold-300">Cómo participar</a>
          <a href="#comprar" className="transition hover:text-gold-300">Comprar</a>
          <a href="#nosotros" className="transition hover:text-gold-300">Nosotros</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={onConsult}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-gold-500/50 px-3 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/10 sm:text-sm"
          >
            <FiSearch size={16} /> Mis números
          </button>
        </div>
      </div>
    </header>
  );
}
