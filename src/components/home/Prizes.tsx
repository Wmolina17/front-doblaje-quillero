import { FiAward, FiGift, FiStar } from "react-icons/fi";
import type { Prize } from "@/types";

export default function Prizes({ prizes }: { prizes: Prize[] }) {
  if (!prizes.length) return null;

  return (
    <section id="premios" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">Lo que te puedes llevar</p>
        <h2 className="section-title mt-2 text-gold-gradient">Premios</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {prizes.map((prize, index) => {
          const main = index === 0;
          const Icon = main ? FiAward : index === 1 ? FiStar : FiGift;
          return (
            <article
              key={`${prize.title}-${index}`}
              className={`relative flex flex-col items-center gap-2 p-7 text-center ${main ? "card-gold shadow-gold sm:col-span-2 lg:col-span-1" : "card"}`}
            >
              <span className="absolute right-4 top-4 rounded-full bg-ink-600 px-2.5 py-0.5 text-xs font-bold text-gold-300">
                #{index + 1}
              </span>
              <span
                className={`mb-2 flex h-16 w-16 items-center justify-center rounded-2xl ${main ? "bg-gold-gradient text-on-gold" : "border border-gold-500/40 text-gold-300"}`}
              >
                <Icon size={28} />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">{prize.title || `Premio ${index + 1}`}</p>
              <p className="font-display text-4xl leading-tight text-ink-50">{prize.amount}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
