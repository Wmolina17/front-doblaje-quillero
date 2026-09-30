import { FiCreditCard, FiHash, FiMail, FiUploadCloud } from "react-icons/fi";

const STEPS = [
  { icon: FiHash, title: "Elige tus boletos", text: "Selecciona cuántos números quieres. Entre más, más chance." },
  { icon: FiCreditCard, title: "Paga como quieras", text: "Nequi, Bancolombia, Daviplata, llaves Bre-B, PayPal y más." },
  { icon: FiUploadCloud, title: "Sube tu comprobante", text: "Llena tus datos y adjunta la captura del pago." },
  { icon: FiMail, title: "Recibe tus números", text: "Al verificar tu pago te llegan tus números al correo." },
];

export default function HowItWorks() {
  return (
    <section id="como-participar" className="border-y border-gold-500/10 bg-ink-900/60 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">Fácil y rápido</p>
          <h2 className="section-title mt-2 text-gold-gradient">¿Cómo participar?</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="card relative p-6">
              <span className="absolute right-5 top-4 font-display text-5xl text-gold-500/20">{index + 1}</span>
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient text-on-gold">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-bold text-ink-50">{title}</h3>
              <p className="mt-1 text-sm text-ink-200">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
