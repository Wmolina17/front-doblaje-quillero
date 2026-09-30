import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiImage, FiSearch } from "react-icons/fi";
import type { RaffleHistoryItem, TicketPage } from "@/types";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatDateTime, formatMoney, formatNumber } from "@/utils/format";
import { notifyError } from "@/utils/swal";
import VoucherModal from "./VoucherModal";

interface Props {
  raffle: RaffleHistoryItem;
  onClose: () => void;
}

export default function RaffleBuyersModal({ raffle, onClose }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<TicketPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [voucherId, setVoucherId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.getTickets({ raffleId: raffle._id, status: "all", page, limit: 50, order: "desc", q: query || undefined }));
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [raffle._id, page, query]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <Modal isOpen onClose={onClose} title={raffle.name} maxWidth="max-w-6xl">
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
        <input
          className="field !pl-10"
          placeholder="Buscar por nombre, correo, referencia o número"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-500">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-ink-900 text-xs uppercase tracking-wider text-gold-300">
            <tr>
              <th className="p-3">Comprador</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3 text-center">Boletos</th>
              <th className="p-3">Números</th>
              <th className="p-3">Método</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Fecha</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={9} className="p-2">
                      <div className="h-9 animate-pulse rounded-lg bg-ink-700" />
                    </td>
                  </tr>
                ))
              : data?.items.map((ticket) => (
                  <tr key={ticket._id} className="border-t border-ink-500 text-ink-100">
                    <td className="p-3">
                      <p className="font-semibold text-ink-50">{ticket.fullName}</p>
                      <p className="text-xs text-ink-200">{ticket.email}</p>
                    </td>
                    <td className="whitespace-nowrap p-3">{ticket.phone}</td>
                    <td className="p-3 text-center font-bold">{ticket.numberTickets}</td>
                    <td className="max-w-[220px] p-3 text-xs text-gold-300">{ticket.approvalCodes.join(", ") || "—"}</td>
                    <td className="p-3">{ticket.paymentMethod}</td>
                    <td className="whitespace-nowrap p-3 font-semibold">{formatMoney(ticket.amountPaid, ticket.currency)}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${ticket.approved ? "bg-success/15 text-green-500" : "bg-gold-500/15 text-gold-300"}`}>
                        {ticket.approved ? "Aprobado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3 text-xs text-ink-200">{formatDateTime(ticket.createdAt)}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        title="Ver comprobante"
                        aria-label="Ver comprobante"
                        onClick={() => setVoucherId(ticket._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gold-300 hover:bg-gold-500/15"
                      >
                        <FiImage />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && data?.items.length === 0 && <p className="py-10 text-center text-ink-200">Sin compras registradas.</p>}
      </div>

      {data && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <Button size="sm" variant="outline" icon={<FiChevronLeft />} disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-ink-200">
            Página {data.page} de {data.pages} · {formatNumber(data.total)} compras
          </span>
          <Button
            size="sm"
            variant="outline"
            icon={<FiChevronRight />}
            className="flex-row-reverse"
            disabled={page >= data.pages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      <VoucherModal ticketId={voucherId} onClose={() => setVoucherId(null)} />
    </Modal>
  );
}
