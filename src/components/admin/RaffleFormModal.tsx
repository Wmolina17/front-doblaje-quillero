import { useState } from "react";
import { FiGift, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import type { Prize, Raffle } from "@/types";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { compressImage, IMAGE_PRESETS } from "@/utils/image";
import { notifyError, notifySuccess } from "@/utils/swal";

const MAX_IMAGES = 8;

interface Props {
  raffle: Raffle | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: Raffle = {
  name: "",
  description: "",
  ticketPrice: 0,
  minTickets: 1,
  maxTicketsPerPurchase: 200,
  totalTickets: 10000,
  drawDate: null,
  images: [],
  prizes: [
    { title: "Premio mayor", amount: "" },
    { title: "Segundo premio", amount: "" },
  ],
  visible: true,
};

const toDateInput = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-CA", { timeZone: "America/Bogota" }) : "";

export default function RaffleFormModal({ raffle, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Raffle>(raffle ? { ...EMPTY, ...raffle } : EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(raffle);

  const set = <K extends keyof Raffle>(key: K, value: Raffle[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const setPrize = (index: number, patch: Partial<Prize>) =>
    set("prizes", form.prizes.map((prize, i) => (i === index ? { ...prize, ...patch } : prize)));

  const addImages = async (files: FileList | null) => {
    if (!files) return;
    if (form.images.length + files.length > MAX_IMAGES) {
      notifyError(new Error(`Máximo ${MAX_IMAGES} imágenes por evento`));
      return;
    }
    try {
      const images = await Promise.all(Array.from(files).map((file) => compressImage(file, IMAGE_PRESETS.raffle)));
      set("images", [...form.images, ...images]);
    } catch (error) {
      notifyError(error);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, drawDate: form.drawDate || null };
      if (isEdit) await api.updateRaffle(payload);
      else await api.createRaffle(payload);
      notifySuccess(isEdit ? "Evento actualizado" : "Evento creado");
      onSaved();
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={isEdit ? "Editar evento" : "Nuevo evento"} maxWidth="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Nombre del evento" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        <Textarea label="Descripción" value={form.description} onChange={(e) => set("description", e.target.value)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Precio del boleto (COP)"
            type="number"
            min={0}
            step="any"
            value={form.ticketPrice}
            onChange={(e) => set("ticketPrice", Number(e.target.value))}
            required
          />
          <Input
            label="Fecha del evento"
            type="date"
            value={toDateInput(form.drawDate)}
            onChange={(e) => set("drawDate", e.target.value ? `${e.target.value}T12:00:00-05:00` : null)}
            hint="Opcional, muestra los días restantes"
          />
          <Input
            label="Mínimo por compra"
            type="number"
            min={1}
            value={form.minTickets}
            onChange={(e) => set("minTickets", Number(e.target.value))}
            required
          />
          <Input
            label="Máximo por compra"
            type="number"
            min={1}
            value={form.maxTicketsPerPurchase}
            onChange={(e) => set("maxTicketsPerPurchase", Number(e.target.value))}
            required
          />
          <Input
            label="Total de números"
            type="number"
            min={10}
            value={form.totalTickets}
            onChange={(e) => set("totalTickets", Number(e.target.value))}
            hint="Ej: 10000 = números del 0000 al 9999"
            required
          />
        </div>

        <div>
          <p className="label">Imágenes</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => addImages(e.target.files)}
            className="w-full text-sm text-ink-200 file:mr-3 file:rounded-xl file:border-0 file:bg-gold-gradient file:px-4 file:py-2 file:font-bold file:text-on-gold"
          />
          {form.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {form.images.map((image, index) => (
                <div key={index} className="relative h-20 w-20">
                  <img src={image} alt="" className="h-full w-full rounded-lg border border-gold-500/30 object-cover" />
                  <button
                    type="button"
                    aria-label="Quitar imagen"
                    onClick={() => set("images", form.images.filter((_, i) => i !== index))}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gold-500/20 bg-ink-900/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="label !mb-0">
              <FiGift className="text-gold-400" /> Premios
            </p>
            <Button size="sm" variant="outline" icon={<FiPlus />} onClick={() => set("prizes", [...form.prizes, { title: "", amount: "" }])}>
              Agregar
            </Button>
          </div>
          <div className="space-y-3">
            {form.prizes.map((prize, index) => (
              <div key={index} className="flex items-center gap-2">
                <input className="field" placeholder="Título (ej: Premio mayor)" value={prize.title} onChange={(e) => setPrize(index, { title: e.target.value })} />
                <input className="field" placeholder="Premio (ej: $5.000.000 o una moto)" value={prize.amount} onChange={(e) => setPrize(index, { amount: e.target.value })} />
                <button
                  type="button"
                  aria-label="Quitar premio"
                  onClick={() => set("prizes", form.prizes.filter((_, i) => i !== index))}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-danger/15"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="dark" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Guardar cambios" : "Crear evento"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
