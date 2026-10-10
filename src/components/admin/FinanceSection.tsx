import { useCallback, useEffect, useState } from "react";
import type { FinanceReport } from "@/types";
import { api } from "@/services/api";
import Button from "@/components/ui/Button";
import { formatMoney, formatNumber } from "@/utils/format";
import { notifyError } from "@/utils/swal";

const dayLabel = (date: string) =>
  new Date(`${date}T12:00:00-05:00`).toLocaleDateString("es-CO", { day: "2-digit", month: "short", weekday: "short", timeZone: "America/Bogota" });

const shiftDay = (date: string, amount: number) =>
  new Date(new Date(`${date}T00:00:00Z`).getTime() + amount * 86_400_000).toISOString().slice(0, 10);

function Kpi({ label, value, hint, gold }: { label: string; value: string; hint?: string; gold?: boolean }) {
  return (
    <div className={`${gold ? "card-gold" : "card"} p-5`}>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-400">{label}</p>
      <p className="mt-1 font-display text-3xl text-ink-50">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-200">{hint}</p>}
    </div>
  );
}

function Progress({ label, percent, caption }: { label: string; percent: number; caption: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold">
        <span className="text-ink-100">{label}</span>
        <span className="text-gold-300">{caption}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink-600">
        <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${Math.min(100, Math.max(1, percent))}%` }} />
      </div>
    </div>
  );
}

const resultColor = (value: number) => (value >= 0 ? "text-green-400" : "text-red-400");
const signed = (value: number) => `${value >= 0 ? "+" : "-"}${formatMoney(Math.abs(value))}`;

const th = "px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-ink-200";
const td = "px-3 py-2 text-sm text-ink-50";

export default function FinanceSection() {
  const [report, setReport] = useState<FinanceReport | null | undefined>(undefined);
  const [range, setRange] = useState<{ startDate?: string; endDate?: string }>({});

  const load = useCallback(
    (next: { startDate?: string; endDate?: string }) =>
      api
        .getFinance(next)
        .then((data) => {
          setReport(data);
          if (data) setRange({ startDate: data.range.startDate, endDate: data.range.endDate });
        })
        .catch(notifyError),
    [],
  );

  useEffect(() => {
    load({});
  }, [load]);

  if (report === undefined) return <div className="h-64 animate-pulse rounded-2xl bg-ink-700" />;
  if (report === null) return <p className="py-16 text-center text-ink-200">Crea un evento para ver su plan financiero.</p>;

  const { plan, progress, scenarios, buyerScenarios, milestones, daily, prizeNumbers } = report;
  const today = progress.startDay && shiftDay(progress.startDay, progress.elapsedDays - 1);
  const applyRange = (startDate?: string, endDate?: string) => {
    setRange({ startDate, endDate });
    if (startDate && endDate && startDate <= endDate) load({ startDate, endDate });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi gold label="Recaudo aprobado" value={formatMoney(progress.revenue)} hint={`${formatMoney(progress.pendingRevenue)} por aprobar`} />
        <Kpi label="Números vendidos" value={formatNumber(progress.sold)} hint={`${progress.soldPercent}% de ${formatNumber(plan.totalTickets)}`} />
        <Kpi label="Compradores" value={formatNumber(progress.buyers)} hint={`${formatNumber(progress.orders)} compras aprobadas`} />
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Resultado actual</p>
          <p className={`mt-1 font-display text-3xl ${resultColor(progress.result)}`}>{signed(progress.result)}</p>
          <p className="mt-1 text-xs text-ink-200">Recaudo menos {formatMoney(plan.totalExpenses)} de gastos</p>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <Progress
          label={`Meta ${plan.goalPercent}% (${formatNumber(plan.goalNumbers)} números)`}
          percent={progress.goalProgressPercent}
          caption={`${progress.goalProgressPercent}%`}
        />
        <Progress
          label={`Punto de equilibrio (${formatNumber(plan.breakEvenNumbers)} números · ${plan.breakEvenPercent}%)`}
          percent={(progress.sold / Math.max(1, plan.breakEvenNumbers)) * 100}
          caption={progress.breakEvenReached ? "Alcanzado" : `Faltan ${formatNumber(progress.numbersToBreakEven)}`}
        />
        <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Día de campaña" value={`${progress.elapsedDays} / ${plan.campaignDays}`} hint={`${progress.daysLeft} días restantes`} />
          <Kpi label="Promedio por día" value={formatMoney(progress.avgRevenuePerDay)} hint={`${progress.avgNumbersPerDay} números · ${progress.avgBuyersPerDay} compradores`} />
          <Kpi label="Necesario por día" value={`${formatNumber(progress.neededNumbersPerDay)} números`} hint={`Meta diaria base: ${formatNumber(plan.dailyGoalNumbers)}`} />
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Proyección al ritmo actual</p>
            <p className="mt-1 font-display text-3xl text-ink-50">{formatNumber(progress.projection.numbers)}</p>
            <p className={`mt-1 text-xs ${resultColor(progress.projection.result)}`}>
              {formatMoney(progress.projection.revenue)} · {signed(progress.projection.result)}
            </p>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-display text-2xl text-gold-gradient">Ventas por rango de fechas</h3>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-xs text-ink-200">
            Desde
            <input type="date" className="field mt-1" value={range.startDate ?? ""} onChange={(e) => applyRange(e.target.value, range.endDate)} />
          </label>
          <label className="text-xs text-ink-200">
            Hasta
            <input type="date" className="field mt-1" value={range.endDate ?? ""} onChange={(e) => applyRange(range.startDate, e.target.value)} />
          </label>
          {today && (
            <>
              <Button size="sm" variant="outline" onClick={() => applyRange(shiftDay(today, -6), today)}>
                Últimos 7 días
              </Button>
              <Button size="sm" variant="outline" onClick={() => load({})}>
                Todo el evento
              </Button>
            </>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Recaudo del rango" value={formatMoney(report.range.revenue)} hint={`${report.range.days} días`} />
          <Kpi label="Promedio diario" value={formatMoney(report.range.avgRevenuePerDay)} hint={`${report.range.avgNumbersPerDay} números/día`} />
          <Kpi label="Compras / compradores" value={`${report.range.orders} / ${report.range.buyers}`} hint={`${report.range.avgOrdersPerDay} compras/día`} />
          <Kpi
            label="Mejor día"
            value={report.range.bestDay ? formatMoney(report.range.bestDay.revenue) : "—"}
            hint={report.range.bestDay ? `${dayLabel(report.range.bestDay.date)} · ${report.range.bestDay.numbers} números` : "Sin ventas"}
          />
        </div>

        <div className="mt-5 max-h-96 overflow-auto rounded-xl border border-gold-500/15">
          <table className="w-full">
            <thead className="sticky top-0 bg-ink-900">
              <tr>
                <th className={th}>Día</th>
                <th className={th}>Compras</th>
                <th className={th}>Números</th>
                <th className={th}>Recaudo</th>
                <th className={th}>Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {daily.map((day) => (
                <tr key={day.date}>
                  <td className={td}>{dayLabel(day.date)}</td>
                  <td className={td}>{day.orders}</td>
                  <td className={td}>{formatNumber(day.numbers)}</td>
                  <td className={td}>{formatMoney(day.revenue)}</td>
                  <td className={`${td} text-ink-200`}>
                    {formatNumber(day.cumulativeNumbers)} · {formatMoney(day.cumulativeRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-display text-2xl text-gold-gradient">Escenarios de venta</h3>
        <p className="mt-1 text-sm text-ink-200">
          Boleto {formatMoney(plan.ticketPrice)} · compra mínima {plan.minTickets} = {formatMoney(plan.minPurchaseAmount)} · gastos {formatMoney(plan.totalExpenses)}.
          Punto de equilibrio: {formatNumber(plan.breakEvenNumbers)} números ({plan.breakEvenPercent}%). Margen en la meta: {plan.goalMargin}%.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gold-500/15">
          <table className="w-full">
            <thead className="bg-ink-900">
              <tr>
                <th className={th}>Venta</th>
                <th className={th}>Números</th>
                <th className={th}>Recaudo</th>
                <th className={th}>Resultado</th>
                <th className={th}>Margen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {scenarios.map((item) => (
                <tr key={item.percent} className={item.isGoal ? "bg-gold-500/10" : ""}>
                  <td className={td}>
                    {item.percent}%{item.isGoal && <span className="ml-2 text-xs text-gold-300">meta</span>}
                  </td>
                  <td className={td}>{formatNumber(item.numbers)}</td>
                  <td className={td}>{formatMoney(item.revenue)}</td>
                  <td className={`${td} font-semibold ${resultColor(item.result)}`}>{signed(item.result)}</td>
                  <td className={td}>{item.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card p-6">
          <h3 className="font-display text-2xl text-gold-gradient">Gastos presupuestados</h3>
          <ul className="mt-4 divide-y divide-gold-500/10 text-sm">
            {plan.expenses.map((item, index) => (
              <li key={index} className="flex justify-between py-2">
                <span className="text-ink-100">{item.concept}</span>
                <span className="font-semibold text-ink-50">{formatMoney(item.amount)}</span>
              </li>
            ))}
            <li className="flex justify-between py-2 font-bold text-gold-300">
              <span>Total</span>
              <span>{formatMoney(plan.totalExpenses)}</span>
            </li>
          </ul>
        </section>

        <section className="card p-6">
          <h3 className="font-display text-2xl text-gold-gradient">Meta acumulada ({plan.campaignDays} días)</h3>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gold-500/15">
            <table className="w-full">
              <thead className="bg-ink-900">
                <tr>
                  <th className={th}>Día</th>
                  <th className={th}>Números</th>
                  <th className={th}>Compradores*</th>
                  <th className={th}>Recaudo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {milestones.map((item) => (
                  <tr key={item.day}>
                    <td className={td}>{item.day}</td>
                    <td className={td}>{formatNumber(item.numbers)}</td>
                    <td className={td}>{formatNumber(item.buyers)}</td>
                    <td className={td}>{formatMoney(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-200">
            *Con {plan.minTickets} números por comprador. Meta diaria: {formatNumber(plan.dailyGoalNumbers)} números y {formatMoney(plan.dailyGoalRevenue)}. Trayectoria lineal de referencia, no un pronóstico.
          </p>
        </section>
      </div>

      <section className="card p-6">
        <h3 className="font-display text-2xl text-gold-gradient">Compradores necesarios</h3>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gold-500/15">
          <table className="w-full">
            <thead className="bg-ink-900">
              <tr>
                <th className={th}>Números por comprador</th>
                <th className={th}>Meta {plan.goalPercent}%</th>
                <th className={th}>100%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {buyerScenarios.map((item) => (
                <tr key={item.perBuyer}>
                  <td className={td}>{item.perBuyer}</td>
                  <td className={td}>
                    {formatNumber(item.goal.buyers)} <span className="text-ink-200">({item.goal.perDay}/día)</span>
                  </td>
                  <td className={td}>
                    {formatNumber(item.full.buyers)} <span className="text-ink-200">({item.full.perDay}/día)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {prizeNumbers.length > 0 && (
        <section className="card p-6">
          <h3 className="font-display text-2xl text-gold-gradient">Números premiados</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {prizeNumbers.map(({ code, holder }) => (
              <li key={code} className="rounded-xl border border-gold-500/20 bg-ink-900/70 p-4">
                <p className="font-display text-3xl tracking-widest text-gold-200">{code}</p>
                {holder ? (
                  <p className="mt-1 text-sm text-ink-100">
                    {holder.fullName}
                    <span className="block text-xs text-ink-200">
                      {holder.phone} · {holder.email}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-ink-200">Aún no asignado</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
