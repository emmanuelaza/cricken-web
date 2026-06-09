"use client";

import { useMemo, useState } from "react";
import type { HistorialEntry } from "@/data/types";
import { formatFecha } from "@/lib/format";

const accionBadge: Record<string, { color: string; bg: string; icon: string }> = {
  crear: { color: "#22C55E", bg: "rgba(34,197,94,0.15)", icon: "🟢" },
  actualizar: { color: "#F5C018", bg: "rgba(245,192,24,0.15)", icon: "🟡" },
  eliminar: { color: "#EF4444", bg: "rgba(239,68,68,0.15)", icon: "🔴" },
};

export function HistorialClient({ entradas }: { entradas: HistorialEntry[] }) {
  const [tabla, setTabla] = useState("");

  const tablas = useMemo(
    () => [...new Set(entradas.map((e) => e.tabla).filter(Boolean))],
    [entradas],
  );
  const filtradas = useMemo(
    () => (tabla ? entradas.filter((e) => e.tabla === tabla) : entradas),
    [entradas, tabla],
  );

  return (
    <div className="space-y-4">
      <select
        value={tabla}
        onChange={(e) => setTabla(e.target.value)}
        className="rounded-lg px-3 py-2 text-sm font-bold text-white"
        style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.3)" }}
      >
        <option value="">Todas las tablas</option>
        {tablas.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <div
        className="admin-scroll overflow-x-auto"
        style={{ background: "#111111", borderRadius: "12px", border: "1px solid rgba(107,33,168,0.2)" }}
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr style={{ color: "#555555" }}>
              {["Fecha", "Acción", "Tabla", "ID registro", "Usuario"].map((h) => (
                <th key={h} className="px-3 py-3 text-[11px] font-black uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((e) => {
              const b = accionBadge[e.accion] ?? accionBadge.actualizar;
              return (
                <tr key={e.id} className="transition-colors hover:bg-[#222222]" style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}>
                  <td className="px-3 py-3 text-xs font-bold" style={{ color: "#888888" }}>
                    {formatFecha(e.created_at)}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-black uppercase" style={{ color: b.color, background: b.bg }}>
                      {b.icon} {e.accion}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-white">{e.tabla}</td>
                  <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>
                    {e.registro_id ? e.registro_id.slice(0, 8) : "—"}
                  </td>
                  <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>
                    {e.usuario ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtradas.length === 0 && (
          <p className="px-5 py-8 text-center text-sm font-bold" style={{ color: "#555555" }}>
            Sin registros. Configura los triggers de auditoría en Supabase.
          </p>
        )}
      </div>
    </div>
  );
}
