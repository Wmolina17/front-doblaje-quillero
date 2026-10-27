import { useCallback, useEffect, useState } from "react";
import { FiAward, FiChevronLeft, FiChevronRight, FiMail, FiPhone, FiSearch } from "react-icons/fi";
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
  const [data, setData] = useState<PurchasedNumberPage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.getPurchasedNumbers({ q: query || undefined, page, limit: PAGE_SIZE }));
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [page, query]);

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
          <FiAward /> Premios asignados
        </h2>
        <p className="mt-1 text-sm text-ink-100">
          Aquí aparecen únicamente números premiados que ya fueron asignados en una compra aprobada.
        </p>
      </section>

      <div className="card grid gap-3 p-4 md:grid-cols-[1fr,auto]">
        <label className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-200" />
          <input
            className="field !pl-10"
            placeholder="Buscar número, titular o correo"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar premios asignados"
          />
        </label>
        <div className="flex items-center justify-center rounded-xl border border-gold-500/20 px-4 text-sm text-ink-100">
          {data ? `${formatNumber(data.total)} premios asignados` : "—"}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="card h-52 animate-pulse bg-ink-700" />
          ))}
        </div>
      ) : data?.items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item) => (
            <article
              key={`${item.code}-${item.email}`}
              className="card-gold relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-gold-400/60"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold-400/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-bold text-green-300">
                    <FiAward /> Premio asignado
                  </span>
                  <span className="text-xs text-ink-200">{formatDateTime(item.createdAt)}</span>
                </div>
                <p className="mt-5 font-display text-5xl tracking-[0.18em] text-gold-200">{item.code}</p>
                <div className="mt-4 border-t border-gold-500/20 pt-4">
                  <p className="font-semibold text-ink-50">{item.fullName}</p>
                  <p className="mt-2 flex items-center gap-2 break-all text-sm text-ink-100">
                    <FiMail className="shrink-0 text-gold-300" /> {item.email}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink-100">
                    <FiPhone className="shrink-0 text-gold-300" /> {item.phone}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card py-14 text-center">
          <FiAward className="mx-auto text-4xl text-gold-400" />
          <p className="mt-3 font-display text-2xl text-gold-200">Aún no hay premios asignados</p>
          <p className="mt-1 text-sm text-ink-200">Los números premiados aparecerán cuando pertenezcan a una compra aprobada.</p>
        </div>
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
  );
}
