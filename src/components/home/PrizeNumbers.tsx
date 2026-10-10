import { FiStar } from "react-icons/fi";

interface Props {
  numbers?: string[];
  amount?: string;
}

export default function PrizeNumbers({ numbers, amount }: Props) {
  if (!numbers?.length) return null;

  return (
    <section id="numeros-premiados" className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <div className="card-gold p-6 text-center shadow-gold md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">Suerte extra</p>
        <h2 className="section-title mt-2 text-gold-gradient">Números premiados</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-100">
          Si entre tus números te sale uno de estos{amount ? `, te ganas ${amount} por cada uno` : ", ganas un premio"}.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
          {numbers.map((code) => (
            <li
              key={code}
              className="flex items-center gap-2 rounded-2xl border border-gold-500/40 bg-ink-900/70 px-5 py-3 font-display text-4xl tracking-widest text-gold-200"
            >
              <FiStar className="text-gold-400" size={18} />
              {code}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
