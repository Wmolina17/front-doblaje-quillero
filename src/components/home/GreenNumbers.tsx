import { FiAward, FiCalendar, FiCheckCircle, FiGift, FiMail, FiSmartphone } from "react-icons/fi";
import type { Raffle } from "@/types";
import { useSettings } from "@/context/SettingsContext";
import { formatMoney, formatNumber } from "@/utils/format";

export default function GreenNumbers({ raffle }: { raffle: Raffle }) {
  const { settings } = useSettings();
  const count = raffle.prizeNumbers?.length ?? 0;
  if (!count) return null;

  return (
    <section id="numeros-verdes" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
          <FiGift aria-hidden="true" size={24} />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">¡Puedes ganar dos veces con el mismo número!</p>
        <h2 className="section-title mt-3 text-gold-gradient">
          ¡{count} números verdes premiados con {raffle.prizeNumberAmount} cada uno!
        </h2>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-5 text-ink-100">
          <h3 className="flex items-center gap-3 text-xl font-bold text-ink-50"><FiMail aria-hidden="true" className="shrink-0 text-gold-400" /> ¿Cómo funciona?</h3>
          <p>Cuando compras tus números, los recibes en tu correo electrónico después de verificar el pago.</p>
          <div className="rounded-2xl border border-success/50 bg-success/10 p-5">
            <p className="text-lg font-bold text-ink-50">
              Si uno de tus números aparece en VERDE, ¡ganaste {raffle.prizeNumberAmount} inmediatamente!
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2"><FiCheckCircle className="mt-1 shrink-0 text-success" /> No tienes que esperar al sorteo de la Lotería de Medellín para ganar ese premio.</li>
              <li className="flex gap-2"><FiCheckCircle className="mt-1 shrink-0 text-success" /> Tu número verde sigue participando por los iPhone.</li>
            </ul>
          </div>
          <p className="flex items-start gap-3"><FiAward aria-hidden="true" className="mt-1 shrink-0 text-gold-400" /><span><strong>Premio mayor:</strong> iPhone 18 Pro Max de 512 GB.</span></p>
          <p className="flex items-start gap-3"><FiSmartphone aria-hidden="true" className="mt-1 shrink-0 text-gold-400" /><span><strong>Número invertido:</strong> iPhone 18 Pro de 256 GB.</span></p>
          <p className="flex items-start gap-3">
            <FiCalendar aria-hidden="true" className="mt-1 shrink-0 text-gold-400" />
            <span>Cuando se venda el 100 % de los {formatNumber(raffle.totalTickets)} números, anunciaremos con anticipación la fecha
            del sorteo de los iPhone, que se realizará con la Lotería de Medellín.</span>
          </p>
          <p className="font-bold text-gold-300">
            ¡Compra desde {raffle.minTickets} números por solo {formatMoney(raffle.minTickets * raffle.ticketPrice)}!
          </p>
        </div>
        <figure className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gold-500/20 px-5 py-4">
            <FiMail className="shrink-0 text-gold-400" size={24} />
            <div>
              <h3 className="font-bold text-ink-50">Así llegan tus números al correo</h3>
              <p className="text-xs text-ink-200">Ejemplo ilustrativo · {settings.siteName}</p>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <p className="font-display text-3xl text-gold-300">¡Tu compra fue aprobada!</p>
            <p className="mt-2 text-sm text-ink-100">Estos son los números de participación de tus stickers digitales:</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gold-500/40 bg-ink-950 p-4 text-center">
                <p className="text-xs font-bold uppercase text-gold-300">Número normal</p>
                <p className="mt-2 font-mono text-3xl font-bold tracking-widest text-gold-300 sm:text-4xl">3842</p>
                <p className="mt-3 text-xs text-ink-100">Participa en el sorteo de los iPhone</p>
              </div>
              <div className="rounded-xl border-2 border-[#22c55e] bg-[#10291b] p-4 text-center text-[#86efac]">
                <p className="text-xs font-bold uppercase">Número verde</p>
                <p className="mt-2 font-mono text-3xl font-bold tracking-widest sm:text-4xl">7156</p>
                <p className="mt-3 text-xs font-bold">¡Premio de {raffle.prizeNumberAmount}!</p>
                <p className="mt-2 text-xs">También participa por los iPhone</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-ink-100">El verde identifica un premio; además, el correo incluye un aviso de ganador. No dependas solo del color.</p>
          </div>
          <figcaption className="border-t border-gold-500/20 px-5 py-4 text-xs leading-relaxed text-ink-200">
            Los números mostrados son ejemplos ficticios, no números realmente asignados ni premiados.
            Tus números se asignan aleatoriamente al aprobar tu pago. Revisa también la carpeta de spam.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
