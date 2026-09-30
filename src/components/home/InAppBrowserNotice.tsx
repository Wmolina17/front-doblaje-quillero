import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";

const isInAppBrowser = () => /Instagram|FBAN|FBAV|TikTok|musical_ly|BytedanceWebview/i.test(navigator.userAgent);

const openExternal = () => {
  const url = window.location.href;
  const clean = url.replace(/^https?:\/\//, "");
  if (/Android/i.test(navigator.userAgent)) {
    window.location.href = `intent://${clean}#Intent;scheme=https;package=com.android.chrome;end`;
    return;
  }
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = `x-safari-https://${clean}`;
    return;
  }
  window.open(url, "_blank");
};

export default function InAppBrowserNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isInAppBrowser());
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-6 text-center backdrop-blur">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 w-fit">
          <Logo size={96} />
        </div>
        <h2 className="font-display text-3xl text-gold-gradient">Ábrelo en tu navegador</h2>
        <p className="mt-2 text-sm text-ink-100">
          Para subir tu comprobante sin problemas, abre esta página en Chrome o Safari.
        </p>
        <button
          type="button"
          onClick={openExternal}
          className="mt-6 w-full rounded-xl bg-gold-gradient px-5 py-3 font-bold text-on-gold"
        >
          Abrir en el navegador
        </button>
        <p className="mt-4 text-xs text-ink-200">
          ¿No abre? Toca los <b>···</b> de arriba y elige <b>“Abrir en el navegador”</b>.
        </p>
        <button type="button" onClick={() => setVisible(false)} className="mt-5 text-xs text-ink-300 underline">
          Continuar aquí de todas formas
        </button>
      </div>
    </div>
  );
}
