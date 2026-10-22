const QUESTIONS = [
  {
    q: "¿Cómo sé que mi compra quedó registrada?",
    a: "Al confirmar la compra verás un resumen en pantalla. Cuando verifiquemos el pago te llegará un correo con los seriales de tus stickers.",
  },
  {
    q: "¿Cuánto tarda la verificación?",
    a: "Normalmente entre 24 y 36 horas. Puedes consultar tus seriales en cualquier momento con tu correo en “Mis stickers”.",
  },
  {
    q: "¿Cómo se asignan los números de serie?",
    a: "Cada sticker recibe un serial aleatorio cuando se aprueba tu pago. Entre más stickers compres, más chance de que te salga uno premiado.",
  },
  {
    q: "¿Qué es el número invertido?",
    a: "Es el serial ganador leído al revés. Por ejemplo, si el serial ganador es 1234, el invertido es 4321 y también se lleva premio.",
  },
  {
    q: "¿Puedo pagar desde fuera de Colombia?",
    a: "Sí. Tenemos métodos en dólares como PayPal, DolarApp y Remitly / Western Union. El total se calcula automáticamente según la tasa del día.",
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h2 className="section-title mb-8 text-center text-gold-gradient">Preguntas frecuentes</h2>
      <div className="space-y-3">
        {QUESTIONS.map(({ q, a }) => (
          <details key={q} className="card group p-5 open:border-gold-500/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-50">
              {q}
              <span className="text-2xl leading-none text-gold-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-ink-100">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
