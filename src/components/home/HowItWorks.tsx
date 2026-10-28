import { FiCalendar, FiCreditCard, FiGift, FiHash, FiMail, FiUploadCloud } from "react-icons/fi";
import type { Raffle } from "@/types";
import { formatMoney } from "@/utils/format";

export default function HowItWorks({ raffle }: { raffle: Raffle }) {
  const steps = [
    { icon: FiHash, title: "Elige tus números", text: `Compra mínimo ${raffle.minTickets} números por ${formatMoney(raffle.minTickets * raffle.ticketPrice)}. Puedes comprar más si quieres.` },
    { icon: FiCreditCard, title: "Realiza tu pago", text: "Escoge tu método de pago: Nequi, Bancolombia, PayPal u otro disponible." },
    { icon: FiUploadCloud, title: "Envía tu comprobante", text: "Llena tus datos y adjunta la captura del pago para verificar tu compra." },
    { icon: FiMail, title: "Recibe tus números en el correo", text: "Una vez confirmado tu pago, recibirás tus números de participación." },
  ];

  return (
    <section id="como-participar" className="scroll-mt-28 border-y border-gold-500/10 bg-ink-900/60 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">Fácil y rápido</p>
          <h2 className="section-title mt-2 text-gold-gradient">¿Cómo participar?</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="card relative p-6">
              <span className="absolute right-5 top-4 font-display text-5xl text-gold-500/20">{index + 1}</span>
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-on-gold">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-bold text-ink-50">{title}</h3>
              <p className="mt-1 text-sm text-ink-200">{text}</p>
            </li>
          ))}
        </ol>
        <div className="card-gold mt-6 grid gap-5 p-5 text-sm text-ink-100 md:grid-cols-2 md:p-6">
          {!!raffle.prizeNumbers?.length && (
            <p className="flex items-start gap-3"><FiGift aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-success" /><span>¿Te llegó un número <strong>VERDE</strong>? ¡Felicitaciones! Ese número tiene un premio de <strong>{raffle.prizeNumberAmount}</strong>.</span></p>
          )}
          <p className="flex items-start gap-3"><FiCalendar aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-gold-400" /><span>Los iPhone se sortearán con la <strong>Lotería de Medellín</strong> cuando se venda el <strong>100 % de los números</strong>. Anunciaremos la fecha con anticipación.</span></p>
        </div>
      </div>
    </section>
  );
}
