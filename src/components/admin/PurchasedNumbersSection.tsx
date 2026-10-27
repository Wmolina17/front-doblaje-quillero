import { useCallback, useEffect, useState } from "react";
import { FiAward, FiChevronLeft, FiChevronRight, FiHash, FiSearch } from "react-icons/fi";
import type { PurchasedNumberPage } from "@/types";
import { api } from "@/services/api";
import Button from "@/components/ui/Button";
import { formatDateTime, formatNumber } from "@/utils/format";
import { notifyError } from "@/utils/swal";

const PAGE_SIZE = 100;

export default function PurchasedNumbersSection() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [winnersOnly, setWinnersOnly] = useState(false);
  const [data, setData] = useState<PurchasedNumberPage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.getPurchasedNumbers({ q: query || undefined, page, limit: PAGE_SIZE, winnersOnly }));
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [page, query, winnersOnly]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = search.trim();
      if (next !== query) {
        setQuery(next);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [search, query]);

  return (
    <div className="space-y-5">
      <section className="card-gold p-5">
        <h2 className="flex items-center gap-2 font-display text-2xl text-gold-200">
          <FiHash /> Números vendidos y sus titulares
        </h2>
        <p className="mt-1 text-sm text-ink-100">
          Consulta los números asignados a compras aprobadas y revisa cuáles premios ya tienen titular.
        </p>
      </section>

      <div className="card grid gap-3 p-4 md:grid-cols-[1fr,auto,auto]">
        <label className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
          <input
            className="field !pl-10"
            placeholder="Buscar número, nombre, correo o teléfono"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar números y titulares"
          />
        </label>
        <Button
          variant={winnersOnly ? "gold" : "outline"}
          icon={<FiAward />}
          aria-pressed={winnersOnly}
          onClick={() => {
            setWinnersOnly((value) => !value);
            setPage(1);
          }}
        >
          {winnersOnly ? "Ver todos los vendidos" : "Premios ya asignados"}
        </Button>
        <div className="flex items-center justify-center rounded-xl border border-gold-500/20 px-4 text-sm text-ink-100">
          {data ? `${formatNumber(data.total)} números` : "—"}
        </div>
      </div>

      <div className="card overflow-x-auto p-2 md:p-4">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-gold-300">
            <tr>
              <th className="p-3">Número</th>
              <th className="p-3">Titular</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Compra aprobada</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="p-2">
                      <div className="h-10 animate-pulse rounded-lg bg-ink-700" />
                    </td>
                  </tr>
                ))
              : data?.items.map((item) => (
                  <tr key={`${item.code}-${item.email}`} className="border-t border-ink-500 text-ink-100 transition hover:bg-gold-500/5">
                    <td className={`p-3 font-display text-xl tracking-widest ${item.winner ? "text-green-300" : "text-gold-200"}`}>
                      {item.code}
                    </td>
                    <td className="p-3 font-semibold text-ink-50">{item.fullName}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.phone}</td>
                    <td className="whitespace-nowrap p-3 text-xs text-ink-200">{formatDateTime(item.createdAt)}</td>
                    <td className="p-3">
                      {item.winner ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-bold text-green-300">
                          <FiAward /> Premio asignado
                        </span>
                      ) : (
                        <span className="text-xs text-ink-200">Sin premio</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && data?.items.length === 0 && (
          <p className="py-12 text-center text-ink-200">
            {winnersOnly ? "Ningún número premiado ha sido asignado todavía." : "No hay números aprobados que coincidan con la búsqueda."}
          </p>
        )}

        {data && data.pages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="outline"
              icon={<FiChevronLeft />}
              disabled={data.page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </Button>
            <span className="text-sm text-ink-200">
              Página {data.page} de {data.pages} · {formatNumber(data.total)} números
            </span>
            <Button
              size="sm"
              variant="outline"
              icon={<FiChevronRight />}
              className="flex-row-reverse"
              disabled={data.page >= data.pages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
