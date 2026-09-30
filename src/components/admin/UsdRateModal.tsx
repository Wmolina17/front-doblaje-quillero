import { useEffect, useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { api } from "@/services/api";
import { useSettings } from "@/context/SettingsContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { formatMoney } from "@/utils/format";
import { notifyError, notifySuccess } from "@/utils/swal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UsdRateModal({ isOpen, onClose }: Props) {
  const { settings, setSettings } = useSettings();
  const [rate, setRate] = useState(String(settings.usdRate));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setRate(String(settings.usdRate));
  }, [isOpen, settings.usdRate]);

  const value = Number(rate);
  const valid = Number.isFinite(value) && value > 0;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    setSaving(true);
    try {
      setSettings(await api.updateSettings({ usdRate: value }));
      notifySuccess("Tasa actualizada");
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tasa del dólar" maxWidth="max-w-md">
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Pesos colombianos por 1 USD"
          type="number"
          min={1}
          step="any"
          icon={<FiDollarSign />}
          value={rate}
          onChange={(event) => setRate(event.target.value)}
          hint="Se usa para calcular el total en métodos de pago en dólares (PayPal, Zelle, bancos de EE. UU.)"
          required
        />
        {valid && (
          <div className="card-gold p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-ink-200">Vista previa</p>
            <p className="mt-1 font-display text-3xl text-gold-300">1 USD = {formatMoney(value)}</p>
            <p className="text-sm text-ink-200">{formatMoney(10000)} ≈ {formatMoney(10000 / value, "USD")}</p>
          </div>
        )}
        <Button type="submit" fullWidth loading={saving} disabled={!valid}>
          Guardar tasa
        </Button>
      </form>
    </Modal>
  );
}
