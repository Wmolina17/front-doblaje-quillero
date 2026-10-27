import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FiStar } from "react-icons/fi";
import "swiper/css";

const STICKERS = Array.from({ length: 10 }, (_, index) => `/stickers/${index + 1}.jpg`);

interface Props {
  numbers?: string[];
  drawnNumbers?: string[];
  amount?: string;
}

export default function StickerCarousel({ numbers = [], drawnNumbers = [], amount }: Props) {
  const cards = numbers.length
    ? numbers.map((code, index) => ({ src: STICKERS[index % STICKERS.length], code }))
    : STICKERS.map((src) => ({ src, code: "" }));
  // Repeat so Swiper loop has enough slides on wide screens
  const slides = Array.from({ length: Math.ceil(18 / cards.length) }, () => cards).flat();

  return (
    <section id="coleccion" className="border-y border-gold-500/10 bg-ink-900/60 py-12">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">Colección oficial</p>
        <h2 className="section-title mt-2 text-gold-gradient">
          {numbers.length ? "Stickers premiados" : "Stickers Quilleros"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-100">
          Cada sticker trae un <b className="text-gold-300">número de serie único</b>.
          {numbers.length
            ? ` Si te sale uno de estos seriales${amount ? `, te ganas ${amount} por cada uno` : ", te llevas premio"}.`
            : " Algunos vienen premiados… ¿te sale uno?"}
        </p>
      </div>

      <Swiper
        modules={[Autoplay]}
        loop
        centeredSlides
        speed={700}
        autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        slidesPerView={2.3}
        spaceBetween={14}
        breakpoints={{ 640: { slidesPerView: 3.5 }, 1024: { slidesPerView: 5.5, spaceBetween: 20 } }}
        className="mt-8 !px-2 !py-3"
      >
        {slides.map(({ src, code }, index) => (
          <SwiperSlide key={index}>
            <div className={`relative overflow-hidden rounded-2xl border border-gold-500/30 bg-ink-800 shadow-lg shadow-black/30 transition ${drawnNumbers.includes(code) ? "" : "hover:-translate-y-1 hover:border-gold-500/70"}`}>
              <img
                src={src}
                alt={code ? `Sticker premiado ${code}${drawnNumbers.includes(code) ? ", ya salió" : ""}` : "Sticker"}
                loading="lazy"
                className={`aspect-square w-full object-cover ${drawnNumbers.includes(code) ? "grayscale opacity-60" : ""}`}
              />
              {code && (
                <span className={`absolute inset-x-0 bottom-0 flex w-full items-center justify-center gap-1.5 bg-gradient-to-t from-black via-black/80 to-transparent pb-3 pt-14 font-display text-4xl leading-none tracking-widest text-gold-200 md:text-5xl ${drawnNumbers.includes(code) ? "text-gray-300" : ""}`}>
                  {/* Bebas Neue digits sit slightly above the line box center */}
                  <FiStar className="shrink-0 -translate-y-[0.06em] fill-gold-400 text-gold-400" size={18} />
                  <span className={drawnNumbers.includes(code) ? "line-through decoration-red-400 decoration-4" : ""}>{code}</span>
                </span>
              )}
              {code && drawnNumbers.includes(code) && (
                <span className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-200">
                  Ya salió
                </span>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
