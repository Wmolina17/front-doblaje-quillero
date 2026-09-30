import { useState } from "react";
import { FiArchive, FiCalendar, FiPlay, FiUsers } from "react-icons/fi";
import type { RaffleHistoryItem } from "@/types";
import { api } from "@/services/api";
import Button from "@/components/ui/Button";
import { formatMoney, formatNumber } from "@/utils/format";
import { confirmAction, notifyError, notifySuccess } from "@/utils/swal";
import RaffleBuyersModal from "./RaffleBuyersModal";

interface Props {
  items: RaffleHistoryItem[] | null;
  canResume: boolean;
  onResumed: () => void;
}

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("es-CO", { dateStyle: "medium", timeZone: "America/Bogota" }) : "—";

export default function RaffleHistory({ items, canResume, onResumed }: Props) {
  const [viewing, setViewing] = useState<RaffleHistoryItem | null>(null);
  const [resumingId, setResumingId] = useState<string | null>(null);

  const resume = async (raffle: RaffleHistoryItem) => {
    if (!(await confirmAction(`¿Reanudar "${raffle.name}"?`, "Volverá a ser el evento activo con todas sus compras y números."))) return;
    setResumingId(raffle._id);
    try {
      await api.resumeRaffle(raffle._id);
      notifySuccess("Evento reanudado");
      onResumed();
    } catch (error) {
      notifyError(error);
    } finally {
      setResumingId(null);
    }
  };

  return (
    <section className="pt-4">
      <h3 className="mb-4 flex items-center gap-2 font-display text-3xl text-gold-gradient">
        <FiArchive className="text-gold-400" size={24} /> Eventos anteriores
      </h3>

      {items === null ? (
        <div className="h-32 animate-pulse rounded-2xl bg-ink-700" />
      ) : items.length === 0 ? (
        <p className="card p-8 text-center text-sm text-ink-200">Aún no hay eventos finalizados.</p>
      ) : (
        <div className="space-y-3">
          {items.map((raffle) => (
            <article key={raffle._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              {raffle.images[0] ? (
                <img src={raffle.images[0]} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-gold-400">
                  <FiArchive size={28} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-bold text-ink-50">{raffle.name}</p>
                <p className="flex flex-wrap items-center gap-x-3 text-xs text-ink-200">
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar /> {formatDate(raffle.createdAt)} → {formatDate(raffle.finishedAt)}
                  </span>
                  <span>Boleto {formatMoney(raffle.ticketPrice)}</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-ink-600 px-2.5 py-1 text-ink-100">
                    {formatNumber(raffle.stats.buyers)} compradores
                  </span>
                  <span className="rounded-full bg-ink-600 px-2.5 py-1 text-ink-100">
                    {formatNumber(raffle.stats.sold)} / {formatNumber(raffle.totalTickets)} vendidos
                  </span>
                  {raffle.stats.pending > 0 && (
                    <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-gold-300">
                      {formatNumber(raffle.stats.pending)} sin verificar
                    </span>
                  )}
                  {raffle.stats.totals.map((total) => (
                    <span key={total.currency} className="rounded-full bg-success/15 px-2.5 py-1 text-green-500">
                      {formatMoney(total.total, total.currency)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" icon={<FiUsers />} onClick={() => setViewing(raffle)}>
                  Compradores
                </Button>
                <Button
                  size="sm"
                  icon={<FiPlay />}
                  disabled={!canResume}
                  loading={resumingId === raffle._id}
                  title={canResume ? "Reanudar evento" : "Finaliza el evento activo para poder reanudar este"}
                  onClick={() => resume(raffle)}
                >
                  Reanudar
                </Button>
              </div>
            </article>
          ))}
          {!canResume && (
            <p className="text-center text-xs text-ink-200">Para reanudar un evento anterior primero finaliza el evento activo.</p>
          )}
        </div>
      )}

      {viewing && <RaffleBuyersModal raffle={viewing} onClose={() => setViewing(null)} />}
    </section>
  );
}
