import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FiArrowUpRight, FiCalendar, FiGift, FiInfo, FiShoppingCart } from "react-icons/fi";
import type { Raffle } from "@/types";
import { formatMoney } from "@/utils/format";
import { formatDescription } from "@/utils/description";
import Countdown from "./Countdown";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HERO_IMAGES = ["/hero/collection-1.webp", "/hero/collection-2.webp", "/hero/collection-3.webp"];

interface Props {
  raffle: Raffle;
  availablePercent: number;
  soldOut: boolean;
  usdRate: number;
  onBuy: () => void;
}

export default function Hero({ raffle, availablePercent, soldOut, usdRate, onBuy }: Props) {
  const priceUsd = raffle.ticketPrice / usdRate;
  const { title, sections } = formatDescription(raffle.description ?? "", raffle.name);

  return (
    <section id="inicio" className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial" />
      <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 md:px-6 lg:grid-cols-[1fr,1.05fr] lg:gap-12">
        <div className="relative min-w-0 lg:sticky lg:top-28">
          <div className="absolute -inset-3 rounded-[2rem] bg-gold-gradient opacity-30 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-gold-500/40 bg-ink-950">
            {HERO_IMAGES.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                loop={HERO_IMAGES.length > 1}
                className="h-full w-full"
              >
                {HERO_IMAGES.map((src, index) => (
                  <SwiperSlide key={index} className="!h-full">
                    <img src={src} alt={`${raffle.name} ${index + 1}`} className="h-full w-full object-contain" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex h-full items-center justify-center">
                <img src="/logo.jpg" alt="" className="h-48 w-48 rounded-full border-4 border-gold-500/60 object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center text-center lg:py-4 lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
              Colección disponible
            </span>
            {raffle.drawDate && <Countdown date={raffle.drawDate} />}
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,3.4vw,3.5rem)] uppercase leading-none text-gold-gradient">
            {title}
          </h1>
          <div className="mt-6 space-y-5 text-left">
            {sections.map(({ heading, paragraphs }, index) => {
              const green = /n[uú]meros? verdes?/i.test(heading);
              const Icon = green ? FiGift : /sorteo/i.test(heading) ? FiCalendar : FiInfo;
              return (
                <div
                  key={index}
                  className={heading
                    ? `rounded-2xl border p-5 md:p-6 ${green ? "border-success/30 bg-success/5" : "border-gold-500/20 bg-ink-800/60"}`
                    : "space-y-3"}
                >
                  {heading && (
                    <h2 className="mb-3 flex items-start gap-3 text-sm font-bold uppercase tracking-wide text-ink-50">
                      <Icon aria-hidden="true" size={20} className={`shrink-0 ${green ? "text-success" : "text-gold-400"}`} />
                      {heading}
                    </h2>
                  )}
                  <div className="space-y-3">
                    {paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex} className="text-sm leading-relaxed text-ink-100 md:text-base">{paragraph}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {!sections.length && (
            <p className="mt-4 text-ink-100">
              Cada número cuesta {formatMoney(raffle.ticketPrice)} COP.
              Compra mínima: {raffle.minTickets} números por {formatMoney(raffle.minTickets * raffle.ticketPrice)}.
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs lg:justify-start">
            <span className="text-ink-200">Equivalente por número: {formatMoney(priceUsd, "USD")}</span>
            <a href="#reglas" className="inline-flex items-center gap-1 font-semibold text-gold-300 hover:underline">
              Reglas de participación <FiArrowUpRight aria-hidden="true" />
            </a>
            {!!raffle.prizeNumbers?.length && (
              <a href="#numeros-verdes" className="inline-flex items-center gap-1 font-semibold text-gold-300 hover:underline">
                Ejemplo del correo <FiArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>

          {soldOut ? (
            <div className="card mt-8 p-5 text-left">
              <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                <span className="text-ink-100">Stickers disponibles</span>
                <span className="rounded-full bg-danger/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-red-500">
                  Compra no disponible
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-ink-600" />
              <p className="mt-3 text-sm text-ink-200">Mantente pendiente de esta página y de nuestras redes para conocer las novedades del sorteo.</p>
            </div>
          ) : (
            <>
              <div className="card mt-8 p-5 text-left">
                <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                  <span className="text-ink-100">Stickers disponibles</span>
                  <span className="text-gold-300">{availablePercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink-600">
                  <div
                    className="h-full rounded-full bg-gold-gradient transition-all duration-1000"
                    style={{ width: `${Math.max(2, availablePercent)}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onBuy}
                className="relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gold-gradient px-8 py-4 text-lg font-extrabold uppercase tracking-wide text-on-gold shadow-gold transition hover:brightness-110 sm:w-auto sm:self-center lg:self-start"
              >
                <span className="pointer-events-none absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                <FiShoppingCart className="relative" />
                <span className="relative">Comprar mis números</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
