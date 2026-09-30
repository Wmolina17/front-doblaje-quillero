import { useCallback, useEffect, useState } from "react";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiImage,
  FiSearch,
  FiSend,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import type { AdminStats, PaymentMethod, Ticket, TicketPage } from "@/types";
import { api, type TicketFilters } from "@/services/api";
import Button from "@/components/ui/Button";
import { escapeHtml, formatDateTime, formatMoney, formatNumber } from "@/utils/format";
import { confirmAction, notifyError, notifySuccess, swal } from "@/utils/swal";
import TicketDetailModal from "./TicketDetailModal";
import EditTicketModal from "./EditTicketModal";
import VoucherModal from "./VoucherModal";

interface Props {
  stats: AdminStats | null;
  methods: PaymentMethod[];
  onStatsChange: () => void;
}

const PAGE_SIZE = 50;

export default function TicketsSection({ stats, methods, onStatsChange }: Props) {
  const [filters, setFilters] = useState<TicketFilters>({
    status: "pending",
    page: 1,
    limit: PAGE_SIZE,
    order: "asc",
  });
  const [search, setSearch] = useState("");
  const [data, setData] = useState<TicketPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [voucherId, setVoucherId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.getTickets(filters));
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => (prev.q === search.trim() ? prev : { ...prev, q: search.trim() || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const updateFilter = (patch: Partial<TicketFilters>) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const replaceTicket = (ticket: Ticket) =>
    setData((prev) => prev && { ...prev, items: prev.items.map((item) => (item._id === ticket._id ? { ...item, ...ticket } : item)) });

  const removeTicket = (id: string) =>
    setData((prev) => prev && { ...prev, total: prev.total - 1, items: prev.items.filter((item) => item._id !== id) });

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    try {
      await action();
      onStatsChange();
    } catch (error) {
      notifyError(error);
    } finally {
      setBusyId(null);
    }
  };

  const approve = async (ticket: Ticket) => {
    if (!(await confirmAction("¿Aprobar esta compra?", `Se asignarán ${ticket.numberTickets} números y se enviarán a ${ticket.email}.`))) return;
    run(ticket._id, async () => {
      const result = await api.approveTicket(ticket._id);
      notifySuccess("Compra aprobada", result.emailSent ? "Números enviados por correo" : "Aprobada, pero el correo no se pudo enviar");
      if (filters.status === "pending") removeTicket(ticket._id);
      else replaceTicket({ ...ticket, approved: true, approvalCodes: result.approvalCodes });
    });
  };

  const reject = async (ticket: Ticket) => {
    const title = ticket.approved ? "¿Eliminar esta compra aprobada?" : "¿Rechazar esta compra?";
    if (!(await confirmAction(title, "El registro se eliminará y no se podrá recuperar.", true))) return;
    run(ticket._id, async () => {
      await api.rejectTicket(ticket._id);
      removeTicket(ticket._id);
      notifySuccess("Registro eliminado");
    });
  };

  const resend = async (ticket: Ticket) => {
    if (!(await confirmAction("¿Reenviar números?", `Se enviarán de nuevo a ${ticket.email}.`))) return;
    run(ticket._id, async () => {
      await api.resendTicket(ticket._id);
      notifySuccess("Correo reenviado");
    });
  };

  const verifyNumber = async () => {
    const { value } = await swal.fire({
      title: "Verificar número",
      input: "text",
      inputPlaceholder: "Ej: 0123",
      showCancelButton: true,
      confirmButtonText: "Buscar",
      cancelButtonText: "Cancelar",
    });
    const code = String(value ?? "").trim();
    if (!code) return;
    try {
      const { sold, ticket } = await api.findTicketByNumber(code);
      if (!sold || !ticket) {
        swal.fire({ icon: "info", title: `El ${escapeHtml(code)} no se ha vendido` });
        return;
      }
      swal.fire({
        icon: "success",
        title: `Número ${escapeHtml(code)} vendido`,
        html: `<div style="text-align:left;line-height:1.9">
          <div><b>Nombre:</b> ${escapeHtml(ticket.fullName)}</div>
          <div><b>Correo:</b> ${escapeHtml(ticket.email)}</div>
          <div><b>Teléfono:</b> ${escapeHtml(ticket.phone)}</div>
          <div><b>Fecha:</b> ${formatDateTime(ticket.createdAt)}</div>
        </div>`,
      });
    } catch (error) {
      notifyError(error);
    }
  };

  const soldPercent = stats?.totalTickets ? Math.round((stats.sold / stats.totalTickets) * 100) : 0;
  const cards = [
    { label: "Vendidos", value: formatNumber(stats?.sold ?? 0), accent: "text-green-400" },
    { label: "Por verificar", value: formatNumber(stats?.pending ?? 0), accent: "text-gold-300" },
    { label: "Disponibles", value: formatNumber(Math.max(0, (stats?.totalTickets ?? 0) - (stats?.sold ?? 0) - (stats?.pending ?? 0))), accent: "text-ink-50" },
    { label: "% vendido", value: `${soldPercent}%`, accent: "text-gold-200" },
  ];

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-4">
            <p className="text-xs uppercase tracking-wider text-ink-200">{card.label}</p>
            <p className={`mt-1 font-display text-4xl ${card.accent}`}>{stats ? card.value : "—"}</p>
          </div>
        ))}
      </div>

      <div className="card mb-6 grid gap-3 p-4 md:grid-cols-[1fr,auto,auto,auto,auto]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
          <input
            className="field !pl-10"
            placeholder="Buscar por nombre, correo, referencia o número"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="field md:w-40"
          value={filters.status}
          onChange={(event) => {
            const status = event.target.value as TicketFilters["status"];
            updateFilter({ status, order: status === "pending" ? "asc" : "desc" });
          }}
          aria-label="Estado"
        >
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="all">Todos</option>
        </select>
        <select
          className="field md:w-44"
          value={filters.paymentMethod ?? ""}
          onChange={(event) => updateFilter({ paymentMethod: event.target.value || undefined })}
          aria-label="Método de pago"
        >
          <option value="">Todos los métodos</option>
          {Array.from(new Set(methods.map((method) => method.name))).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="field md:w-44"
          value={filters.order}
          onChange={(event) => updateFilter({ order: event.target.value as TicketFilters["order"] })}
          aria-label="Orden"
        >
          <option value="desc">Más recientes</option>
          <option value="asc">Más antiguos</option>
        </select>
        <Button variant="outline" icon={<FiSearch />} onClick={verifyNumber}>
          Verificar número
        </Button>
      </div>

      <div className="card overflow-x-auto p-2 md:p-4">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-gold-300">
            <tr>
              <th className="p-3">Cliente</th>
              <th className="p-3 text-center">Boletos</th>
              <th className="p-3">Referencia</th>
              <th className="p-3">Método</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Fecha</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={7} className="p-2">
                      <div className="h-10 animate-pulse rounded-lg bg-ink-700" />
                    </td>
                  </tr>
                ))
              : data?.items.map((ticket) => (
                  <tr key={ticket._id} className="border-t border-ink-500 text-ink-100 transition hover:bg-gold-500/5">
                    <td className="p-3">
                      <button type="button" onClick={() => setDetail(ticket)} className="text-left hover:text-gold-300">
                        <p className="font-semibold text-ink-50">{ticket.fullName}</p>
                        <p className="text-xs text-ink-200">{ticket.email}</p>
                      </button>
                    </td>
                    <td className="p-3 text-center font-bold">{ticket.numberTickets}</td>
                    <td className="max-w-[160px] truncate p-3">{ticket.reference}</td>
                    <td className="p-3">{ticket.paymentMethod}</td>
                    <td className="whitespace-nowrap p-3 font-semibold text-gold-200">{formatMoney(ticket.amountPaid, ticket.currency)}</td>
                    <td className="whitespace-nowrap p-3 text-xs text-ink-200">{formatDateTime(ticket.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        {!ticket.approved && (
                          <>
                            <Button size="sm" variant="success" icon={<FiCheck />} loading={busyId === ticket._id} onClick={() => approve(ticket)}>
                              Aprobar
                            </Button>
                            <Button size="sm" variant="danger" icon={<FiX />} disabled={busyId === ticket._id} onClick={() => reject(ticket)}>
                              Rechazar
                            </Button>
                          </>
                        )}
                        <IconAction title="Ver comprobante" onClick={() => setVoucherId(ticket._id)} icon={<FiImage />} />
                        <IconAction title="Ver detalle" onClick={() => setDetail(ticket)} icon={<FiEye />} />
                        <IconAction title="Editar" onClick={() => setEditing(ticket)} icon={<FiEdit2 />} />
                        {ticket.approved && (
                          <>
                            <IconAction title="Reenviar correo" onClick={() => resend(ticket)} icon={<FiSend />} />
                            <IconAction title="Eliminar" onClick={() => reject(ticket)} icon={<FiTrash2 />} danger />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && data?.items.length === 0 && <p className="py-12 text-center text-ink-200">No hay compras para mostrar.</p>}

        {data && data.pages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="outline"
              icon={<FiChevronLeft />}
              disabled={filters.page <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              Anterior
            </Button>
            <span className="text-sm text-ink-200">
              Página {data.page} de {data.pages} · {formatNumber(data.total)} registros
            </span>
            <Button
              size="sm"
              variant="outline"
              icon={<FiChevronRight />}
              className="flex-row-reverse"
              disabled={filters.page >= data.pages}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      <TicketDetailModal ticket={detail} onClose={() => setDetail(null)} onViewVoucher={setVoucherId} />
      <VoucherModal ticketId={voucherId} onClose={() => setVoucherId(null)} />
      {editing && (
        <EditTicketModal
          ticket={editing}
          methods={methods}
          onClose={() => setEditing(null)}
          onSaved={(ticket) => {
            replaceTicket(ticket);
            onStatsChange();
          }}
        />
      )}
    </>
  );
}

function IconAction({ title, onClick, icon, danger }: { title: string; onClick: () => void; icon: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        danger ? "text-red-400 hover:bg-danger/15" : "text-gold-300 hover:bg-gold-500/15"
      }`}
    >
      {icon}
    </button>
  );
}
