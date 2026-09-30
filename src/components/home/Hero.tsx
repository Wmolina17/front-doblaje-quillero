import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { FiShoppingCart } from "react-icons/fi";
import type { Raffle } from "@/types";
import { formatMoney } from "@/utils/format";
import Countdown from "./Countdown";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  raffle: Raffle;
  availablePercent: number;
  soldOut: boolean;
  usdRate: number;
  onBuy: () => void;
}

export default function Hero({ raffle, availablePercent, soldOut, usdRate, onBuy }: Props) {
  const priceUsd = raffle.ticketPrice / usdRate;

  return (
    <section id="inicio" className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-gold-radial" />
      <div className="relative mx-auto grid max-w-7xl items-stretch gap-10 px-4 md:px-6 lg:grid-cols-[1fr,1.05fr] lg:gap-12">
        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gold-gradient opacity-30 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-gold-500/40 bg-ink-900 lg:absolute lg:inset-0 lg:aspect-auto">
            {raffle.images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                loop={raffle.images.length > 1}
                className="h-full"
              >
                {raffle.images.map((src, index) => (
                  <SwiperSlide key={index} className="!h-full">
                    <img src={src} alt={`${raffle.name} ${index + 1}`} className="h-full w-full object-cover" />
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

        <div className="flex flex-col justify-center text-center lg:py-4 lg:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
              Evento activo
            </span>
            {raffle.drawDate && <Countdown date={raffle.drawDate} />}
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,3.4vw,3.5rem)] uppercase leading-none text-gold-gradient">
            {raffle.name}
          </h1>
          {raffle.description && (
            <p className="mt-4 whitespace-pre-line text-lg text-ink-100 md:text-xl">{raffle.description}</p>
          )}

          <div className="mt-6 inline-flex flex-wrap items-end justify-center gap-x-3 gap-y-1 lg:justify-start">
            <span className="text-sm uppercase tracking-widest text-ink-200">Boleto a solo</span>
            <span className="font-display text-5xl leading-none text-gold-300">{formatMoney(raffle.ticketPrice)}</span>
            <span className="text-sm text-ink-200">≈ {formatMoney(priceUsd, "USD")}</span>
          </div>

          {soldOut ? (
            <div className="card mt-8 p-5 text-left">
              <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                <span className="text-ink-100">Boletos disponibles</span>
                <span className="rounded-full bg-danger/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-red-500">
                  ¡Agotado! · 100% vendido
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-ink-600" />
              <p className="mt-3 text-sm text-ink-200">Mantente pendiente de nuestras redes para el próximo evento.</p>
            </div>
          ) : (
            <>
              <div className="card mt-8 p-5 text-left">
                <div className="mb-3 flex items-center justify-between text-sm font-semibold">
                  <span className="text-ink-100">Boletos disponibles</span>
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
                <span className="relative">Comprar boletos</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
