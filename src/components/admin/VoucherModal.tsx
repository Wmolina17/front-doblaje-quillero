import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";

interface Props {
  ticketId: string | null;
  onClose: () => void;
}

export default function VoucherModal({ ticketId, onClose }: Props) {
  const [voucher, setVoucher] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticketId) return;
    setVoucher(null);
    setError("");
    api
      .getVoucher(ticketId)
      .then(setVoucher)
      .catch((err: Error) => setError(err.message));
  }, [ticketId]);

  return (
    <Modal isOpen={Boolean(ticketId)} onClose={onClose} title="Comprobante de pago" maxWidth="max-w-xl">
      {error && <p className="text-center text-red-400">{error}</p>}
      {!voucher && !error && (
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500/20 border-t-gold-400" />
        </div>
      )}
      {voucher && (
        <a href={voucher} target="_blank" rel="noopener noreferrer" download="comprobante.jpg">
          <img src={voucher} alt="Comprobante" className="mx-auto max-h-[70vh] rounded-xl border border-gold-500/30 object-contain" />
        </a>
      )}
    </Modal>
  );
}
