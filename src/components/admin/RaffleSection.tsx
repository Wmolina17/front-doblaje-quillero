import { useCallback, useEffect, useState } from "react";
import { FiCalendar, FiEdit3, FiEye, FiEyeOff, FiFlag, FiGift, FiPlus } from "react-icons/fi";
import type { Raffle, RaffleHistoryItem } from "@/types";
import { api } from "@/services/api";
import Button from "@/components/ui/Button";
import { formatMoney, formatNumber } from "@/utils/format";
import { confirmAction, notifyError, notifySuccess } from "@/utils/swal";
import RaffleFormModal from "./RaffleFormModal";
import RaffleHistory from "./RaffleHistory";

interface Props {
  raffle: Raffle | null;
  onChange: () => void;
}

export default function RaffleSection({ raffle, onChange }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [history, setHistory] = useState<RaffleHistoryItem[] | null>(null);

  const loadHistory = useCallback(() => api.getRaffleHistory().then(setHistory).catch(notifyError), []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const refresh = () => {
    onChange();
    loadHistory();
  };

  const toggleVisibility = async () => {
    const hide = raffle?.visible;
    if (!(await confirmAction(hide ? "¿Ocultar el evento?" : "¿Mostrar el evento?", "El cambio se verá en la página principal."))) return;
    try {
      await api.toggleRaffleVisibility();
      notifySuccess(hide ? "Evento oculto" : "Evento visible");
      onChange();
    } catch (error) {
      notifyError(error);
    }
  };

  const finish = async () => {
    if (
      !(await confirmAction(
        "¿Finalizar el evento actual?",
        "El evento pasará al historial con todas sus compras y compradores. Podrás reanudarlo después si no hay otro evento activo.",
        true,
      ))
    )
      return;
    try {
      await api.finishRaffle();
      notifySuccess("Evento finalizado", "Quedó guardado en el historial");
      refresh();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="card overflow-hidden">
        {raffle?.images[0] ? (
          <img src={raffle.images[0]} alt={raffle.name} className="h-64 w-full object-cover sm:h-80" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-ink-900 text-gold-400">
            <FiGift size={48} />
          </div>
        )}
        <div className="p-6">
          <h3 className="font-display text-4xl text-gold-gradient">{raffle?.name || "Sin evento activo"}</h3>
          <p className="mt-1 whitespace-pre-line text-sm text-ink-200">{raffle?.description || "Crea un evento para empezar a vender."}</p>
          {raffle && (
            <>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-gold-500/15 px-3 py-1 text-gold-300">Boleto: {formatMoney(raffle.ticketPrice)}</span>
                <span className="rounded-full bg-ink-600 px-3 py-1 text-ink-100">
                  Compra: {raffle.minTickets} – {raffle.maxTicketsPerPurchase}
                </span>
                <span className="rounded-full bg-ink-600 px-3 py-1 text-ink-100">Números: {formatNumber(raffle.totalTickets)}</span>
                <span className={`rounded-full px-3 py-1 ${raffle.visible ? "bg-success/15 text-green-400" : "bg-danger/15 text-red-400"}`}>
                  {raffle.visible ? "● Visible" : "● Oculta"}
                </span>
              </div>
              {raffle.drawDate && (
                <p className="mt-3 flex items-center gap-2 text-sm text-ink-100">
                  <FiCalendar className="text-gold-400" />
                  {new Date(raffle.drawDate).toLocaleDateString("es-CO", { dateStyle: "long", timeZone: "America/Bogota" })}
                </p>
              )}
              {raffle.prizes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {raffle.prizes.map((prize, index) => (
                    <span key={index} className="rounded-lg border border-gold-500/30 px-2.5 py-1 text-xs text-gold-200">
                      {prize.title}: {prize.amount}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {raffle ? (
          <>
            <Button icon={<FiEdit3 />} onClick={() => setFormOpen(true)}>
              Editar evento
            </Button>
            <Button variant="outline" icon={raffle.visible ? <FiEyeOff /> : <FiEye />} onClick={toggleVisibility}>
              {raffle.visible ? "Ocultar evento" : "Mostrar evento"}
            </Button>
            <Button variant="danger" icon={<FiFlag />} className="sm:col-span-2" onClick={finish}>
              Finalizar evento
            </Button>
          </>
        ) : (
          <Button icon={<FiPlus />} className="sm:col-span-2" onClick={() => setFormOpen(true)}>
            Crear nuevo evento
          </Button>
        )}
      </div>

      {formOpen && <RaffleFormModal raffle={raffle} onClose={() => setFormOpen(false)} onSaved={onChange} />}

      <RaffleHistory items={history} canResume={!raffle} onResumed={refresh} />
    </div>
  );
}
