const QUESTIONS = [
  {
    q: "¿Cómo sé que mi compra quedó registrada?",
    a: "Al confirmar la compra verás un resumen en pantalla. Cuando verifiquemos el pago te llegará un correo con los números de participación de tus stickers digitales. Los números premiados estarán en verde y tendrán un aviso de ganador. Revisa también spam.",
  },
  {
    q: "¿Debo esperar al sorteo si me llega un número verde?",
    a: "No. El número verde ya está premiado y no tienes que esperar al sorteo de la Lotería de Medellín para ganar ese premio. Ese mismo número sigue participando por los iPhone. Contacta a soporte para verificar y gestionar tu premio.",
  },
  {
    q: "¿Cuándo se sortean los iPhone?",
    a: "Con la Lotería de Medellín cuando se venda el 100 % de los números disponibles. El organizador anunciará con anticipación la fecha oficial en sus redes sociales y en esta página. Consulta también el apartado de reglas antes de comprar.",
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
