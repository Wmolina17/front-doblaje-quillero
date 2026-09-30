import { ReactNode, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl border border-gold-500/30 bg-gradient-to-b from-ink-700 to-ink-900 p-6 shadow-gold md:p-8`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-ink-200 transition hover:text-gold-300"
        >
          <FiX size={22} />
        </button>
        {title && <h2 className="mb-6 pr-8 font-display text-3xl tracking-wide text-gold-gradient">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
