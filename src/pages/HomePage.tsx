import { useCallback, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { FiInbox } from "react-icons/fi";
import { api } from "@/services/api";
import type { PaymentMethod, RaffleResponse } from "@/types";
import { useSettings } from "@/context/SettingsContext";
import { whatsappLink } from "@/utils/format";
import Logo from "@/components/ui/Logo";
import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/home/Hero";
import Prizes from "@/components/home/Prizes";
import HowItWorks from "@/components/home/HowItWorks";
import PurchaseSection from "@/components/home/PurchaseSection";
import About from "@/components/home/About";
import Faq from "@/components/home/Faq";
import SiteFooter from "@/components/home/SiteFooter";
import ConsultModal from "@/components/home/ConsultModal";
import InAppBrowserNotice from "@/components/home/InAppBrowserNotice";

const TICKER = [
  "Eventos oficiales de Doblaje Quillero",
  "Eche, no te quedes por fuera",
  "Paga con Nequi, Bancolombia, Daviplata, Bre-B o PayPal",
  "Tus números llegan a tu correo",
  "¡El que no juega no gana, mi llave!",
];

function HomePage() {
  const { settings, loading: settingsLoading } = useSettings();
  const [data, setData] = useState<RaffleResponse | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultOpen, setConsultOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const [raffleData, paymentMethods] = await Promise.all([api.getRaffle(), api.getPaymentMethods()]);
      setData(raffleData);
      setMethods(paymentMethods);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    document.title = `${settings.siteName} | Eventos oficiales`;
  }, [settings.siteName]);

  const whatsapp = settings.supportWhatsapp || settings.supportPhone;
  const supportUrl = whatsapp ? whatsappLink(whatsapp, "Hola, necesito ayuda con mi compra de boletos") : undefined;

  if (loading || settingsLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
        <div className="animate-pulse">
          <Logo size={96} />
        </div>
        <p className="font-display text-3xl tracking-wide text-gold-gradient">{settings.siteName}</p>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500/20 border-t-gold-400" />
      </div>
    );
  }

  const raffle = data?.raffle ?? null;
  const stats = data?.stats;
  const availablePercent = raffle?.visible ? stats?.availablePercent ?? 0 : 0;
  const canBuy = Boolean(raffle?.visible && stats && stats.maxPurchasable >= raffle.minTickets);

  return (
    <div className="min-h-screen bg-ink-950">
      <InAppBrowserNotice />

      <div className="overflow-hidden border-b border-gold-500/20 bg-gold-gradient">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap py-1.5">
          {[...TICKER, ...TICKER].map((text, index) => (
            <span key={index} className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-widest text-on-gold">
              <span className="text-base">★</span> {text}
            </span>
          ))}
        </div>
      </div>

      <SiteHeader onConsult={() => setConsultOpen(true)} />

      <main>
        {raffle ? (
          <>
            <Hero
              raffle={raffle}
              availablePercent={availablePercent}
              soldOut={!canBuy}
              usdRate={settings.usdRate}
              onBuy={() => document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth" })}
            />
            <Prizes prizes={raffle.prizes} />
            {canBuy && <HowItWorks />}
            {canBuy && stats && (
              <PurchaseSection
                raffle={raffle}
                maxPurchasable={stats.maxPurchasable}
                availablePercent={availablePercent}
                methods={methods}
                usdRate={settings.usdRate}
                onPurchased={load}
              />
            )}
          </>
        ) : (
          <section className="relative flex min-h-[60vh] items-center justify-center px-6 py-24">
            <div className="pointer-events-none absolute inset-0 bg-gold-radial" />
            <div className="relative max-w-md text-center">
              <span className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-500/40 text-gold-300">
                <FiInbox size={36} />
              </span>
              <h1 className="font-display text-5xl text-gold-gradient">Se viene algo bacano</h1>
              <p className="mt-3 text-ink-100">
                Ahora mismo no hay un evento activo. Síguenos en redes para enterarte primero del próximo.
              </p>
            </div>
          </section>
        )}
        <About />
        <Faq />
      </main>

      <SiteFooter />

      {supportUrl && (
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 font-bold text-white shadow-xl shadow-black/40 transition hover:scale-105"
        >
          <FaWhatsapp size={22} />
          <span className="text-sm">Soporte</span>
        </a>
      )}

      <ConsultModal isOpen={consultOpen} onClose={() => setConsultOpen(false)} supportUrl={supportUrl} />
    </div>
  );
}

export default HomePage;
