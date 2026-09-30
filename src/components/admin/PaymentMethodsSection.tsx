import { useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiPlus, FiTrash2 } from "react-icons/fi";
import type { PaymentMethod } from "@/types";
import { api } from "@/services/api";
import Button from "@/components/ui/Button";
import BankLogo from "@/components/ui/BankLogo";
import { confirmAction, notifyError, notifySuccess } from "@/utils/swal";
import PaymentMethodFormModal from "./PaymentMethodFormModal";

interface Props {
  methods: PaymentMethod[];
  onChange: () => void;
}

export default function PaymentMethodsSection({ methods, onChange }: Props) {
  const [editing, setEditing] = useState<PaymentMethod | null | undefined>(undefined);

  const toggle = async (method: PaymentMethod) => {
    try {
      await api.savePaymentMethod({ ...method, active: !method.active });
      onChange();
    } catch (error) {
      notifyError(error);
    }
  };

  const remove = async (method: PaymentMethod) => {
    if (!method._id || !(await confirmAction(`¿Eliminar ${method.name}?`, "Las compras ya registradas conservan el nombre del método.", true))) return;
    try {
      await api.deletePaymentMethod(method._id);
      notifySuccess("Método eliminado");
      onChange();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-200">
          Agrega bancos de Colombia, llaves Bre-B, billeteras, PayPal o bancos de EE. UU. Los métodos en USD se calculan con la tasa configurada en “Redes y contacto”.
        </p>
        <Button icon={<FiPlus />} onClick={() => setEditing(null)}>
          Agregar método
        </Button>
      </div>

      {methods.length === 0 ? (
        <p className="card p-10 text-center text-ink-200">Todavía no hay métodos de pago. Agrega el primero.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {methods.map((method) => (
            <article key={method._id} className={`card p-5 ${method.active ? "" : "opacity-60"}`}>
              <div className="flex items-start gap-3">
                <BankLogo provider={method.provider} logoUrl={method.logoUrl} name={method.name} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold text-ink-50">{method.name}</p>
                  <p className="text-xs text-ink-200">
                    {method.currency} · {method.active ? "Visible" : "Oculto"}
                    {method.holder ? ` · ${method.holder}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <IconButton title={method.active ? "Ocultar" : "Mostrar"} onClick={() => toggle(method)}>
                    {method.active ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                  <IconButton title="Editar" onClick={() => setEditing(method)}>
                    <FiEdit2 />
                  </IconButton>
                  <IconButton title="Eliminar" onClick={() => remove(method)} danger>
                    <FiTrash2 />
                  </IconButton>
                </div>
              </div>
              {method.fields.length > 0 && (
                <dl className="mt-4 space-y-1.5 text-sm">
                  {method.fields.map((field) => (
                    <div key={`${field.label}-${field.value}`} className="flex justify-between gap-3">
                      <dt className="text-ink-200">{field.label}</dt>
                      <dd className="truncate font-semibold text-ink-50">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          ))}
        </div>
      )}

      {editing !== undefined && <PaymentMethodFormModal method={editing} onClose={() => setEditing(undefined)} onSaved={onChange} />}
    </div>
  );
}

function IconButton({ title, onClick, danger, children }: { title: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${danger ? "text-red-400 hover:bg-danger/15" : "text-gold-300 hover:bg-gold-500/15"}`}
    >
      {children}
    </button>
  );
}
