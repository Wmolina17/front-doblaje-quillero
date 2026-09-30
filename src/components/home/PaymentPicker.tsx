import { useState } from "react";
import { FiCheck, FiCopy, FiInfo } from "react-icons/fi";
import type { PaymentMethod } from "@/types";
import BankLogo from "@/components/ui/BankLogo";
import { formatMoney } from "@/utils/format";

interface Props {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect: (method: PaymentMethod) => void;
  total: number;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-500 py-2.5 last:border-b-0">
      <span className="text-xs text-ink-200">{label}</span>
      <button
        type="button"
        onClick={copy}
        className="flex min-w-0 items-center gap-2 text-right text-sm font-semibold text-ink-50 transition hover:text-gold-300"
        aria-label={`Copiar ${label}`}
      >
        <span className="truncate">{value}</span>
        {copied ? <FiCheck className="shrink-0 text-success" /> : <FiCopy className="shrink-0 text-ink-200" />}
      </button>
    </div>
  );
}

export default function PaymentPicker({ methods, selectedId, onSelect, total }: Props) {
  const selected = methods.find((method) => method._id === selectedId);

  if (!methods.length) {
    return <p className="card p-5 text-center text-sm text-ink-200">Pronto habilitaremos los métodos de pago.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {methods.map((method) => {
          const active = method._id === selectedId;
          return (
            <button
              key={method._id}
              type="button"
              onClick={() => onSelect(method)}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition ${
                active ? "border-gold-500 bg-gold-500/10 shadow-gold" : "border-ink-400 bg-ink-900/60 hover:border-gold-500/50"
              }`}
            >
              {active && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-on-gold">
                  <FiCheck size={12} />
                </span>
              )}
              <BankLogo provider={method.provider} logoUrl={method.logoUrl} name={method.name} />
              <span className="text-center text-xs font-bold text-ink-50">{method.name}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-200">{method.currency}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="card-gold mt-5 p-5">
          <div className="mb-2 flex items-center gap-3">
            <BankLogo provider={selected.provider} logoUrl={selected.logoUrl} name={selected.name} size={48} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-ink-200">Paga con</p>
              <p className="truncate text-lg font-bold text-gold-200">{selected.name}</p>
            </div>
          </div>
          {selected.holder && <CopyRow label="Titular" value={selected.holder} />}
          {selected.fields.map((field) => (
            <CopyRow key={`${field.label}-${field.value}`} label={field.label} value={field.value} />
          ))}
          {selected.instructions && (
            <p className="mt-3 flex gap-2 whitespace-pre-line rounded-xl bg-ink-900/70 p-3 text-xs text-ink-100">
              <FiInfo className="mt-0.5 shrink-0 text-gold-400" />
              {selected.instructions}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-gold-500/30 bg-ink-950/60 px-4 py-3">
            <span className="text-sm text-ink-100">Total a pagar</span>
            <span className="font-display text-3xl text-gold-300">{formatMoney(total, selected.currency)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
