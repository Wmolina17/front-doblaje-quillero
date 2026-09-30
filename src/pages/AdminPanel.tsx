import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FiAward,
  FiCreditCard,
  FiDollarSign,
  FiExternalLink,
  FiGift,
  FiLogOut,
  FiMenu,
  FiPieChart,
  FiShare2,
  FiTag,
} from "react-icons/fi";
import type { AdminStats, PaymentMethod, Raffle } from "@/types";
import { api, tokenStorage } from "@/services/api";
import { useSettings } from "@/context/SettingsContext";
import Logo from "@/components/ui/Logo";
import TicketsSection from "@/components/admin/TicketsSection";
import RaffleSection from "@/components/admin/RaffleSection";
import PaymentMethodsSection from "@/components/admin/PaymentMethodsSection";
import SettingsSection from "@/components/admin/SettingsSection";
import TopBuyersModal from "@/components/admin/TopBuyersModal";
import SummaryModal from "@/components/admin/SummaryModal";
import UsdRateModal from "@/components/admin/UsdRateModal";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { formatMoney } from "@/utils/format";
import { notifyError } from "@/utils/swal";

type Section = "tickets" | "raffle" | "payments" | "settings";

const SECTIONS: { id: Section; label: string; title: string; icon: IconType }[] = [
  { id: "tickets", label: "Compras", title: "Compras y boletos", icon: FiTag },
  { id: "raffle", label: "Evento", title: "Gestión del evento", icon: FiGift },
  { id: "payments", label: "Métodos de pago", title: "Métodos de pago", icon: FiCreditCard },
  { id: "settings", label: "Redes y contacto", title: "Redes, contacto y marca", icon: FiShare2 },
];

function AdminPanel() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [section, setSection] = useState<Section>("tickets");
  const [menuOpen, setMenuOpen] = useState(false);
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [topOpen, setTopOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);

  const loadStats = useCallback(() => api.getAdminStats().then(setStats).catch(notifyError), []);
  const loadRaffle = useCallback(() => api.getFullRaffle().then(setRaffle).catch(notifyError), []);
  const loadMethods = useCallback(() => api.getAllPaymentMethods().then(setMethods).catch(notifyError), []);

  useEffect(() => {
    loadStats();
    loadRaffle();
    loadMethods();
  }, [loadStats, loadRaffle, loadMethods]);

  const logout = () => {
    tokenStorage.clear();
    navigate("/admin");
  };

  const current = SECTIONS.find((item) => item.id === section)!;
  const navButton = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition";

  return (
    <div className="flex min-h-screen bg-ink-950 text-ink-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gold-500/20 bg-ink-900 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-gold-500/15 px-5 py-5">
          <Logo size={42} />
          <div className="min-w-0">
            <p className="truncate font-display text-2xl leading-none text-gold-gradient">{settings.siteName}</p>
            <p className="text-xs text-ink-200">Panel admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-widest text-ink-300">Gestión</p>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setMenuOpen(false);
              }}
              className={`${navButton} ${section === id ? "bg-gold-gradient text-on-gold" : "text-ink-100 hover:bg-gold-500/10"}`}
            >
              <Icon size={18} /> {label}
              {id === "tickets" && !!stats?.pendingOrders && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold ${section === id ? "bg-black/20" : "bg-gold-500/20 text-gold-300"}`}>
                  {stats.pendingOrders}
                </span>
              )}
            </button>
          ))}

          <p className="px-3 pb-1 pt-5 text-[11px] uppercase tracking-widest text-ink-300">Reportes</p>
          <button type="button" onClick={() => setTopOpen(true)} className={`${navButton} text-ink-100 hover:bg-gold-500/10`}>
            <FiAward size={18} /> Top compradores
          </button>
          <button type="button" onClick={() => setSummaryOpen(true)} className={`${navButton} text-ink-100 hover:bg-gold-500/10`}>
            <FiPieChart size={18} /> Balance
          </button>
          <button type="button" onClick={() => setRateOpen(true)} className={`${navButton} text-ink-100 hover:bg-gold-500/10`}>
            <FiDollarSign size={18} /> Tasa del dólar
            <span className="ml-auto text-xs text-ink-200">{formatMoney(settings.usdRate)}</span>
          </button>
        </nav>

        <div className="space-y-1 border-t border-gold-500/15 p-3">
          <ThemeToggle withLabel />
          <a href="/" target="_blank" rel="noopener noreferrer" className={`${navButton} text-ink-100 hover:bg-gold-500/10`}>
            <FiExternalLink size={18} /> Ver página
          </a>
          <button type="button" onClick={logout} className={`${navButton} text-red-400 hover:bg-danger/10`}>
            <FiLogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {menuOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMenuOpen(false)} role="presentation" />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gold-500/15 bg-ink-950/90 px-4 py-4 backdrop-blur md:px-8">
          <button type="button" className="text-gold-300 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <FiMenu size={22} />
          </button>
          <h1 className="font-display text-3xl tracking-wide text-gold-gradient">{current.title}</h1>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {section === "tickets" && <TicketsSection stats={stats} methods={methods} onStatsChange={loadStats} />}
          {section === "raffle" && (
            <RaffleSection
              raffle={raffle}
              onChange={() => {
                loadRaffle();
                loadStats();
              }}
            />
          )}
          {section === "payments" && <PaymentMethodsSection methods={methods} onChange={loadMethods} />}
          {section === "settings" && <SettingsSection />}
        </main>
      </div>

      <TopBuyersModal isOpen={topOpen} onClose={() => setTopOpen(false)} />
      <SummaryModal isOpen={summaryOpen} onClose={() => setSummaryOpen(false)} />
      <UsdRateModal isOpen={rateOpen} onClose={() => setRateOpen(false)} />
    </div>
  );
}

export default AdminPanel;
