import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TopBuyer } from "@/types";
import { api } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { notifyError } from "@/utils/swal";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TopBuyersModal({ isOpen, onClose }: Props) {
  const [buyers, setBuyers] = useState<TopBuyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"table" | "chart">("table");
  const [range, setRange] = useState({ start: "", end: "" });
  const light = useTheme().theme === "light";

  const load = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    try {
      setBuyers(await api.getTopBuyers(start, end));
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

  const chartData = buyers.map((buyer) => ({
    name: buyer.fullName.split(" ").slice(0, 2).join(" "),
    totalTickets: buyer.totalTickets,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top compradores" maxWidth="max-w-4xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-2">
          <input type="date" className="field !w-auto" value={range.start} onChange={(e) => setRange({ ...range, start: e.target.value })} aria-label="Desde" />
          <input type="date" className="field !w-auto" value={range.end} onChange={(e) => setRange({ ...range, end: e.target.value })} aria-label="Hasta" />
          <Button size="sm" onClick={() => load(range.start, range.end)} disabled={!range.start || !range.end}>
            Filtrar
          </Button>
          {(range.start || range.end) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setRange({ start: "", end: "" });
                load();
              }}
            >
              General
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={view === "table" ? "gold" : "outline"} onClick={() => setView("table")}>
            Tabla
          </Button>
          <Button size="sm" variant={view === "chart" ? "gold" : "outline"} onClick={() => setView("chart")}>
            Gráfico
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-ink-700" />
      ) : buyers.length === 0 ? (
        <p className="py-10 text-center text-ink-200">Sin compras aprobadas en este rango.</p>
      ) : view === "table" ? (
        <div className="overflow-x-auto rounded-2xl border border-ink-500">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-900 text-xs uppercase tracking-wider text-gold-300">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Boletos</th>
                <th className="p-3">Compras</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer, index) => (
                <tr key={buyer._id} className="border-t border-ink-500 text-ink-100">
                  <td className="p-3 font-display text-xl text-gold-400">{index + 1}</td>
                  <td className="p-3 font-semibold">{buyer.fullName}</td>
                  <td className="p-3 text-ink-200">{buyer._id}</td>
                  <td className="p-3">{buyer.phone}</td>
                  <td className="p-3 font-bold text-gold-300">{buyer.totalTickets}</td>
                  <td className="p-3">{buyer.purchases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={light ? "#E2DDD2" : "#2E2B25"} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: light ? "#1A1814" : "#E8E6E1", fontSize: 13 }} />
              <Tooltip
                cursor={{ fill: "rgba(212,175,55,0.08)" }}
                contentStyle={{
                  background: light ? "#FFFFFF" : "#121110",
                  border: "1px solid #B8912A",
                  borderRadius: 12,
                  color: light ? "#1A1814" : "#E8E6E1",
                }}
              />
              <Bar dataKey="totalTickets" name="Boletos" fill="#D4AF37" radius={[0, 8, 8, 0]} barSize={28}>
                <LabelList dataKey="totalTickets" position="insideRight" fill="#050505" fontWeight={700} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Modal>
  );
}
