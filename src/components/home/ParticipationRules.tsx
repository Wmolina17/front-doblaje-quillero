import { FaWhatsapp } from "react-icons/fa6";
import { FiMessageCircle } from "react-icons/fi";
import type { Raffle } from "@/types";
import { formatMoney, formatNumber } from "@/utils/format";

interface Props {
  raffle: Raffle;
  supportUrl?: string;
}

export default function ParticipationRules({ raffle, supportUrl }: Props) {
  return (
    <>
      <section id="reglas" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-6">
        <h2 className="section-title text-center text-gold-gradient">Reglas de participación</h2>
        <dl className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <dt className="font-bold text-gold-300">Compra y asignación</dt>
            <dd className="mt-3 text-sm leading-relaxed text-ink-100">
              Cada sticker digital incluye un número único de participación de {formatMoney(raffle.ticketPrice)} COP.
              La compra mínima es de {raffle.minTickets} números por {formatMoney(raffle.minTickets * raffle.ticketPrice)}.
              Los números se asignan aleatoriamente y se envían por correo después de verificar el pago.
            </dd>
          </div>
          <div className="card p-6">
            <dt className="font-bold text-gold-300">Sorteo de los iPhone</dt>
            <dd className="mt-3 text-sm leading-relaxed text-ink-100">
              Se realizará con la Lotería de Medellín cuando se venda el 100 % de los {formatNumber(raffle.totalTickets)} números.
              El número ganador participa por el iPhone 18 Pro Max de 512 GB y su invertido por el iPhone 18 Pro de 256 GB.
              Por ejemplo: 1234 se invierte a 4321.
              {raffle.drawDate
                ? ` La fecha anunciada del sorteo es el ${new Date(raffle.drawDate).toLocaleDateString("es-CO", { dateStyle: "long", timeZone: "America/Bogota" })}.`
                : " La fecha oficial se anunciará con anticipación en las redes sociales y en esta página."}
            </dd>
          </div>
          <div className="card p-6">
            <dt className="font-bold text-gold-300">Cierre y venta del 100 %</dt>
            <dd className="mt-3 text-sm leading-relaxed text-ink-100">
              No se ha comunicado una fecha límite de cierre de ventas. El sorteo de los iPhone está condicionado a vender el 100 %.
              No se ha comunicado una política de plazos, cancelación o devoluciones si no se completa la venta.
              Consulta estas condiciones con soporte antes de comprar.
            </dd>
          </div>
          <div className="card p-6">
            <dt className="font-bold text-gold-300">Números verdes y atención de premios</dt>
            <dd className="mt-3 text-sm leading-relaxed text-ink-100">
              Un número marcado en verde en tu correo tiene un premio de {raffle.prizeNumberAmount}, sin esperar al sorteo,
              y sigue participando por los iPhone. Para solicitar atención sobre tu premio, contacta a soporte con el correo
              de tu compra, tu número y la referencia de pago para verificarlo. Los plazos y condiciones de entrega deben
              ser confirmados por el organizador.
            </dd>
          </div>
        </dl>
      </section>
      <section id="ayuda" className="border-y border-success/20 bg-success/10 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <FiMessageCircle aria-hidden="true" className="mx-auto mb-4 text-success" size={32} />
          <h2 className="section-title text-gold-gradient">¿Necesitas ayuda para comprar?</h2>
          <p className="mt-4 text-ink-100">¿No sabes cómo comprar tus números o tienes dudas con el pago? ¡Tranquilo!</p>
          {supportUrl ? (
            <>
              <p className="mt-3 text-ink-100">
                Haz clic en el botón verde de <strong>SOPORTE (WhatsApp)</strong> y te ayudaremos paso a paso para que puedas realizar tu compra.
              </p>
              <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#15803d] px-6 py-3 font-bold text-white transition hover:brightness-110">
                <FaWhatsapp size={22} /> Soporte por WhatsApp
              </a>
            </>
          ) : (
            <p className="mt-3 text-ink-100">Consulta los canales de contacto del organizador al pie de esta página.</p>
          )}
          <p className="mt-5 font-bold text-ink-50">¡No te quedes sin participar!</p>
        </div>
      </section>
    </>
  );
}
