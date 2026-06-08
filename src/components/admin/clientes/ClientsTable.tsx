"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ClientRow } from "@/components/admin/clientes/ClientRow";
import type { Cliente } from "@/data/types";
import { calcularSegmento, diasDesde } from "@/lib/segmentos";

const selectStyle = {
  background: "#1A1A1A",
  border: "1px solid rgba(107,33,168,0.3)",
} as const;

export function ClientsTable({ clientes }: { clientes: Cliente[] }) {
  const [segmento, setSegmento] = useState("");
  const [sede, setSede] = useState("");
  const [q, setQ] = useState("");

  const sedes = useMemo(
    () => [...new Set(clientes.map((c) => c.sede_favorita).filter(Boolean))],
    [clientes],
  );

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    return clientes.filter((c) => {
      const dias = diasDesde(c.updated_at ?? c.created_at);
      const seg = calcularSegmento(c.total_pedidos ?? 0, dias);
      if (segmento && seg !== segmento) return false;
      if (sede && c.sede_favorita !== sede) return false;
      if (
        term &&
        !c.nombre?.toLowerCase().includes(term) &&
        !(c.telefono ?? "").toLowerCase().includes(term)
      )
        return false;
      return true;
    });
  }, [clientes, segmento, sede, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={segmento}
          onChange={(e) => setSegmento(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm font-bold text-white"
          style={selectStyle}
        >
          <option value="">Todos los segmentos</option>
          <option value="vip">VIP</option>
          <option value="regular">Regular</option>
          <option value="nuevo">Nuevo</option>
          <option value="en_riesgo">En riesgo</option>
        </select>

        <select
          value={sede}
          onChange={(e) => setSede(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm font-bold text-white"
          style={selectStyle}
        >
          <option value="">Todas las sedes</option>
          {sedes.map((s) => (
            <option key={s} value={s as string}>
              {s}
            </option>
          ))}
        </select>

        <div
          className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2"
          style={selectStyle}
        >
          <Search size={15} style={{ color: "#888888" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nombre o teléfono"
            className="bg-transparent text-sm font-bold text-white outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <div
        className="admin-scroll overflow-x-auto"
        style={{
          background: "#111111",
          borderRadius: "12px",
          border: "1px solid rgba(107,33,168,0.2)",
        }}
      >
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr style={{ color: "#555555" }}>
              {["Cliente", "Tel", "Pedidos", "Gastado", "Sede", "Segmento", "Último"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-[11px] font-black uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <ClientRow key={c.id} cliente={c} />
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <p
            className="px-5 py-8 text-center text-sm font-bold"
            style={{ color: "#555555" }}
          >
            No hay clientes que coincidan.
          </p>
        )}
      </div>
    </div>
  );
}
