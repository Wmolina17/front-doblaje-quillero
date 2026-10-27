import { useState } from "react";
import { FiAward, FiCheckCircle, FiClock, FiMail, FiSearch } from "react-icons/fi";
import { api } from "@/services/api";
import type { LookupResult } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supportUrl?: string;
}

export default function ConsultModal({ isOpen, onClose, supportUrl }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);

  const close = () => {
    setEmail("");
    setError("");
    setResult(null);
    onClose();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      setResult(await api.lookupTickets(email));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Consulta tus stickers" maxWidth="max-w-md">
      <p className="-mt-3 mb-5 text-sm text-ink-200">Escribe el correo con el que hiciste tu compra.</p>
      <form onSubmit={submit} className="space-y-4">
        <Input
          type="email"
          icon={<FiMail />}
          label="Correo electrónico"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tucorreo@gmail.com"
          required
        />
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <Button type="submit" fullWidth loading={loading} icon={<FiSearch />}>
          Consultar
        </Button>
      </form>

      {result && (
        <div className="card-gold mt-6 p-5">
          <p className="flex items-center gap-2 font-bold text-gold-200">
            <FiCheckCircle /> {result.fullName}
          </p>
          <p className="mb-3 text-xs text-ink-200">{result.email}</p>
          {result.winningCodes.length > 0 && (
            <div className="mb-4 rounded-xl border-2 border-gold-400 bg-gold-500/15 p-4 text-center">
              <p className="flex items-center justify-center gap-2 font-display text-2xl text-gold-200">
                <FiAward /> ¡HAS SIDO GANADOR!
              </p>
              <p className="mt-1 text-sm text-ink-50">
                Número{result.winningCodes.length === 1 ? "" : "s"} premiado{result.winningCodes.length === 1 ? "" : "s"}:{" "}
                <strong>{result.winningCodes.join(", ")}</strong>
              </p>
            </div>
          )}
          {result.codes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.codes.map((code) => (
                <span key={code} className={`rounded-lg border bg-ink-950 px-3 py-1.5 font-display text-xl tracking-widest ${
                  result.winningCodes.includes(code) ? "border-green-400 text-green-300" : "border-gold-500/40 text-gold-300"
                }`}>
                  {code}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-100">Aún no tienes stickers aprobados.</p>
          )}
          {result.pendingOrders > 0 && (
            <p className="mt-4 flex items-center gap-2 text-xs text-ink-100">
              <FiClock className="text-gold-400" />
              Tienes {result.pendingOrders} compra{result.pendingOrders === 1 ? "" : "s"} en verificación.
            </p>
          )}
        </div>
      )}

      {supportUrl && (
        <p className="mt-6 text-center text-xs text-ink-200">
          ¿Problemas con tus stickers?{" "}
          <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-300 underline">
            Escríbenos por WhatsApp
          </a>
        </p>
      )}
    </Modal>
  );
}
