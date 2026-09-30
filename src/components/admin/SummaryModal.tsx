import { useEffect, useState } from "react";
import type { SummaryItem } from "@/types";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";
import { formatMoney, formatNumber } from "@/utils/format";
import { notifyError } from "@/utils/swal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SummaryModal({ isOpen, onClose }: Props) {
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api
      .getSummary()
      .then(setItems)
      .catch(notifyError)
      .finally(() => setLoading(false));
  }, [isOpen]);

  const totals = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.currency] = (acc[item.currency] ?? 0) + item.total;
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Balance por método de pago" maxWidth="max-w-4xl">
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-28 animate-pulse rounded-2xl bg-ink-700" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-ink-200">Aún no hay compras aprobadas.</p>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {Object.entries(totals).map(([currency, total]) => (
              <div key={currency} className="card-gold p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Total {currency}</p>
                <p className="mt-1 font-display text-4xl text-gold-200">{formatMoney(total, currency as SummaryItem["currency"])}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item) => (
              <div key={`${item.paymentMethod}-${item.currency}`} className="card p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-200">{item.paymentMethod}</p>
                <p className="mt-1 text-2xl font-extrabold text-ink-50">{formatMoney(item.total, item.currency)}</p>
                <p className="mt-1 text-xs text-ink-200">{formatNumber(item.tickets)} boletos</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
