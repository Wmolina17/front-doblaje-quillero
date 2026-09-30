import { useState } from "react";
import type { PaymentMethod, Ticket } from "@/types";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { notifyError, notifySuccess } from "@/utils/swal";

interface Props {
  ticket: Ticket;
  methods: PaymentMethod[];
  onClose: () => void;
  onSaved: (ticket: Ticket) => void;
}

export default function EditTicketModal({ ticket, methods, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    email: ticket.email,
    phone: ticket.phone,
    numberTickets: ticket.numberTickets,
    paymentMethodId: ticket.paymentMethodId ?? "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateTicket(ticket._id, {
        email: form.email,
        phone: form.phone,
        numberTickets: ticket.approved ? undefined : Number(form.numberTickets),
        paymentMethodId: form.paymentMethodId || undefined,
      });
      notifySuccess("Datos actualizados");
      onSaved(updated);
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Editar compra">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Correo" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Teléfono" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <Input
          label="Cantidad de boletos"
          type="number"
          min={1}
          value={form.numberTickets}
          onChange={(e) => setForm({ ...form, numberTickets: Number(e.target.value) })}
          disabled={ticket.approved}
          hint={ticket.approved ? "No se puede cambiar en compras aprobadas" : "El monto se recalcula automáticamente"}
        />
        <div>
          <label htmlFor="edit-method" className="label">
            Método de pago
          </label>
          <select
            id="edit-method"
            className="field"
            value={form.paymentMethodId}
            onChange={(e) => setForm({ ...form, paymentMethodId: e.target.value })}
          >
            {!form.paymentMethodId && <option value="">{ticket.paymentMethod}</option>}
            {methods.map((method) => (
              <option key={method._id} value={method._id}>
                {method.name} ({method.currency})
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" fullWidth loading={saving}>
          Guardar cambios
        </Button>
      </form>
    </Modal>
  );
}
