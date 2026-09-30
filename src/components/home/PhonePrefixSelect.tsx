import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const COUNTRIES = [
  { code: "co", name: "Colombia", dial: "+57" },
  { code: "us", name: "Estados Unidos", dial: "+1" },
  { code: "ve", name: "Venezuela", dial: "+58" },
  { code: "ec", name: "Ecuador", dial: "+593" },
  { code: "pe", name: "Perú", dial: "+51" },
  { code: "pa", name: "Panamá", dial: "+507" },
  { code: "mx", name: "México", dial: "+52" },
  { code: "es", name: "España", dial: "+34" },
  { code: "cl", name: "Chile", dial: "+56" },
  { code: "ar", name: "Argentina", dial: "+54" },
  { code: "do", name: "República Dominicana", dial: "+1809" },
  { code: "cr", name: "Costa Rica", dial: "+506" },
];

const flagUrl = (code: string) => `https://flagcdn.com/24x18/${code}.png`;

interface Props {
  value: string;
  onChange: (dial: string) => void;
}

export default function PhonePrefixSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find((country) => country.dial === value) ?? COUNTRIES[0];

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-full items-center gap-1.5 rounded-l-xl border border-r-0 border-ink-400 bg-ink-900 px-3 py-2.5 text-ink-50 transition hover:bg-ink-700"
      >
        <img src={flagUrl(selected.code)} alt={selected.name} className="h-[14px] w-5 rounded-sm object-cover" />
        <span className="text-sm font-semibold">{selected.dial}</span>
        <FiChevronDown size={14} className={`text-ink-200 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute left-0 top-full z-30 mt-1 max-h-64 w-60 overflow-y-auto rounded-xl border border-gold-500/30 bg-ink-800 shadow-2xl">
          {COUNTRIES.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(country.dial);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink-50 transition hover:bg-gold-500/10"
              >
                <img src={flagUrl(country.code)} alt="" className="h-[14px] w-5 shrink-0 rounded-sm object-cover" />
                <span className="flex-1 truncate">{country.name}</span>
                <span className="text-ink-200">{country.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
