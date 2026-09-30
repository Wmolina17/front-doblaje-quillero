import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { PaymentMethod } from "@/types";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import BankLogo from "@/components/ui/BankLogo";
import { Input, Textarea } from "@/components/ui/Field";
import { BANK_PROVIDERS, COUNTRY_LABELS, FIELD_SUGGESTIONS, findProvider } from "@/utils/banks";
import { notifyError, notifySuccess } from "@/utils/swal";

interface Props {
  method: PaymentMethod | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: PaymentMethod = {
  name: "Nequi",
  provider: "nequi",
  logoUrl: "",
  currency: "COP",
  holder: "",
  fields: [
    { label: "Número Nequi", value: "" },
    { label: "Llave Bre-B", value: "" },
  ],
  instructions: "",
  active: true,
  order: 0,
};

const GROUPS = (["CO", "US", "INT"] as const).map((country) => ({
  country,
  providers: BANK_PROVIDERS.filter((provider) => provider.country === country),
}));

export default function PaymentMethodFormModal({ method, onClose, onSaved }: Props) {
  const [form, setForm] = useState<PaymentMethod>(method ?? EMPTY);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof PaymentMethod>(key: K, value: PaymentMethod[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const changeProvider = (id: string) => {
    const provider = findProvider(id);
    if (!provider) return;
    setForm((prev) => {
      const values = new Map(prev.fields.map((field) => [field.label, field.value]));
      return {
        ...prev,
        provider: id,
        name: id === "custom" ? prev.name : provider.name,
        currency: provider.currency,
        fields: provider.fields.length
          ? provider.fields.map((label) => ({ label, value: values.get(label) ?? "" }))
          : prev.fields,
      };
    });
  };

  const setField = (index: number, key: "label" | "value", value: string) =>
    set("fields", form.fields.map((field, i) => (i === index ? { ...field, [key]: value } : field)));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.savePaymentMethod({ ...form, fields: form.fields.filter((field) => field.label.trim() && field.value.trim()) });
      notifySuccess("Método de pago guardado");
      onSaved();
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={method ? "Editar método de pago" : "Nuevo método de pago"} maxWidth="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border border-gold-500/20 bg-ink-900/70 p-4">
          <BankLogo provider={form.provider} logoUrl={form.logoUrl} name={form.name || "?"} size={56} />
          <div className="flex-1">
            <label htmlFor="provider" className="label">
              Banco / plataforma
            </label>
            <select id="provider" className="field" value={form.provider} onChange={(e) => changeProvider(e.target.value)}>
              {GROUPS.map(({ country, providers }) => (
                <optgroup key={country} label={COUNTRY_LABELS[country]}>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre visible" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <div>
            <label htmlFor="currency" className="label">
              Moneda de cobro
            </label>
            <select id="currency" className="field" value={form.currency} onChange={(e) => set("currency", e.target.value as PaymentMethod["currency"])}>
              <option value="COP">COP – Pesos colombianos</option>
              <option value="USD">USD – Dólares</option>
            </select>
          </div>
          <Input label="Titular de la cuenta" value={form.holder} onChange={(e) => set("holder", e.target.value)} placeholder="Nombre del titular" />
          <Input label="Orden" type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} hint="Menor número aparece primero" />
        </div>

        <Input
          label="Logo personalizado (URL)"
          value={form.logoUrl}
          onChange={(e) => set("logoUrl", e.target.value)}
          placeholder="Opcional, se usa el logo del banco por defecto"
        />

        <div className="rounded-2xl border border-gold-500/20 bg-ink-900/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="label !mb-0">Datos para pagar (cuentas, llaves, correos…)</p>
            <Button size="sm" variant="outline" icon={<FiPlus />} onClick={() => set("fields", [...form.fields, { label: "", value: "" }])}>
              Campo
            </Button>
          </div>
          <datalist id="field-suggestions">
            {FIELD_SUGGESTIONS.map((label) => (
              <option key={label} value={label} />
            ))}
          </datalist>
          <div className="space-y-2">
            {form.fields.map((field, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="field sm:max-w-[200px]"
                  list="field-suggestions"
                  placeholder="Ej: Llave Bre-B"
                  value={field.label}
                  onChange={(e) => setField(index, "label", e.target.value)}
                />
                <input className="field" placeholder="Valor" value={field.value} onChange={(e) => setField(index, "value", e.target.value)} />
                <button
                  type="button"
                  aria-label="Quitar campo"
                  onClick={() => set("fields", form.fields.filter((_, i) => i !== index))}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-danger/15"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-200">Los campos vacíos no se muestran. El cliente puede copiar cada dato con un toque.</p>
        </div>

        <Textarea
          label="Instrucciones (opcional)"
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
          placeholder="Ej: Envía el pago exacto y guarda la captura."
        />

        <label className="flex items-center gap-3 text-sm text-ink-100">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-gold-500" />
          Visible para los clientes
        </label>

        <div className="flex justify-end gap-3">
          <Button variant="dark" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
