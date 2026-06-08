"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { OrderRow } from "@/components/admin/pedidos/OrderRow";
import type { Pedido } from "@/data/types";

const selectStyle = {
  background: "#1A1A1A",
  border: "1px solid rgba(107,33,168,0.3)",
} as const;

export function OrdersTable({ pedidos }: { pedidos: Pedido[] }) {
  const [estado, setEstado] = useState("");
  const [sede, setSede] = useState("");
  const [canal, setCanal] = useState("");
  const [q, setQ] = useState("");

  const sedes = useMemo(
    () => [...new Set(pedidos.map((p) => p.sede).filter(Boolean))],
    [pedidos],
  );
  const canales = useMemo(
    () => [...new Set(pedidos.map((p) => p.canal).filter(Boolean))],
    [pedidos],
  );

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    return pedidos.filter((p) => {
      if (estado && p.estado !== estado) return false;
      if (sede && p.sede !== sede) return false;
      if (canal && p.canal !== canal) return false;
      if (
        term &&
        !p.cliente_nombre?.toLowerCase().includes(term) &&
        !p.id.toLowerCase().includes(term) &&
        !p.cliente_telefono?.toLowerCase().includes(term)
      )
        return false;
      return true;
    });
  }, [pedidos, estado, sede, canal, q]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm font-bold text-white"
          style={selectStyle}
        >
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="confirmado">Confirmado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <select
          value={sede}
          onChange={(e) => setSede(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm font-bold text-white"
          style={selectStyle}
        >
          <option value="">Todas las sedes</option>
          {sedes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={canal}
          onChange={(e) => setCanal(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm font-bold capitalize text-white"
          style={selectStyle}
        >
          <option value="">Todos los canales</option>
          {canales.map((c) => (
            <option key={c} value={c}>
              {c}
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
            placeholder="Buscar cliente o #"
            className="bg-transparent text-sm font-bold text-white outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <div
        className="admin-scroll overflow-x-auto"
        style={{
          background: "#111111",
          borderRadius: "12px",
          border: "1px solid rgba(107,33,168,0.2)",
        }}
      >
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr style={{ color: "#555555" }}>
              {["#Pedido", "Cliente", "Total", "Sede", "Canal", "Hora", "Estado", ""].map(
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
            {filtrados.map((p) => (
              <OrderRow key={p.id} pedido={p} />
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <p
            className="px-5 py-8 text-center text-sm font-bold"
            style={{ color: "#555555" }}
          >
            No hay pedidos que coincidan.
          </p>
        )}
      </div>
    </div>
  );
}
