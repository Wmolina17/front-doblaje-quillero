import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

const startOfBogotaDay = (value: string) => {
  const ymd = new Date(value).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  return new Date(`${ymd}T00:00:00-05:00`).getTime();
};

const getRemaining = (target: number) => {
  const diff = Math.max(0, target - Date.now());
  return {
    días: Math.floor(diff / 86_400_000),
    horas: Math.floor((diff / 3_600_000) % 24),
    min: Math.floor((diff / 60_000) % 60),
    seg: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
};

export default function Countdown({ date }: { date: string }) {
  const target = startOfBogotaDay(date);
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    setRemaining(getRemaining(target));
    const interval = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (Number.isNaN(target)) return null;

  if (remaining.done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-1 text-xs font-bold uppercase tracking-widest text-on-gold">
        <FiClock /> ¡Es hoy!
      </span>
    );
  }

  const units = [
    [remaining.días, "d"],
    [remaining.horas, "h"],
    [remaining.min, "m"],
    [remaining.seg, "s"],
  ] as const;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-ink-800/80 px-3 py-1 text-sm text-ink-100"
      aria-label="Tiempo restante para el evento"
    >
      <FiClock className="text-gold-400" />
      <span className="text-[11px] uppercase tracking-wider text-ink-200">Faltan</span>
      <span className="flex items-baseline gap-1.5 font-bold tabular-nums">
        {units.map(([value, unit]) => (
          <span key={unit} className="text-gold-300">
            {String(value).padStart(2, "0")}
            <span className="ml-0.5 text-[10px] font-semibold text-ink-200">{unit}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
