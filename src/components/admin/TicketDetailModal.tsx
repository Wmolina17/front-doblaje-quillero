import { FiCheckCircle, FiClock } from "react-icons/fi";
import type { Ticket } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatDateTime, formatMoney } from "@/utils/format";

interface Props {
  ticket: Ticket | null;
  onClose: () => void;
  onViewVoucher: (id: string) => void;
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-500 py-2.5 last:border-b-0">
      <span className="text-xs text-ink-200">{label}</span>
      <span className="break-all text-right text-sm font-semibold text-ink-50">{value ?? "—"}</span>
    </div>
  );
}

export default function TicketDetailModal({ ticket, onClose, onViewVoucher }: Props) {
  if (!ticket) return null;

  return (
    <Modal isOpen onClose={onClose} title="Detalle de la compra">
      <span
        className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          ticket.approved ? "bg-success/15 text-green-400" : "bg-gold-500/15 text-gold-300"
        }`}
      >
        {ticket.approved ? <FiCheckCircle /> : <FiClock />}
        {ticket.approved ? "Aprobado" : "Pendiente"}
      </span>
      <Row label="Nombre" value={ticket.fullName} />
      <Row label="Correo" value={ticket.email} />
      <Row label="Teléfono" value={ticket.phone} />
      <Row label="Boletos" value={ticket.numberTickets} />
      <Row label="Números" value={ticket.approvalCodes.join(", ") || undefined} />
      <Row label="Referencia" value={ticket.reference} />
      <Row label="Método" value={ticket.paymentMethod} />
      <Row label="Monto" value={formatMoney(ticket.amountPaid, ticket.currency)} />
      <Row label="Fecha" value={formatDateTime(ticket.createdAt)} />
      <Button
        variant="outline"
        fullWidth
        className="mt-5"
        onClick={() => {
          onClose();
          onViewVoucher(ticket._id);
        }}
      >
        Ver comprobante
      </Button>
    </Modal>
  );
}
