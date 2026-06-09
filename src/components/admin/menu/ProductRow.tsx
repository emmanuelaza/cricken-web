"use client";

import { Badge } from "@/components/Badge";
import type { Producto } from "@/data/types";
import { formatPriceCOP } from "@/lib/format";

export function ProductRow({
  producto,
  guardando,
  onEdit,
  onToggle,
}: {
  producto: Producto;
  guardando: boolean;
  onEdit: (p: Producto) => void;
  onToggle: (p: Producto) => void;
}) {
  return (
    <tr
      className="transition-colors hover:bg-[#222222]"
      style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}
    >
      <td className="px-3 py-3 text-xl">{producto.emoji}</td>
      <td className="px-3 py-3 font-bold text-white">{producto.nombre}</td>
      <td className="px-3 py-3 font-bold capitalize" style={{ color: "#888888" }}>
        {producto.categoria}
      </td>
      <td className="px-3 py-3 font-black" style={{ color: "#F5C018" }}>
        {formatPriceCOP(producto.precio)}
      </td>
      <td className="px-3 py-3">
        {producto.badge_texto && producto.badge_tipo ? (
          <Badge texto={producto.badge_texto} tipo={producto.badge_tipo} />
        ) : (
          <span style={{ color: "#555555" }}>—</span>
        )}
      </td>
      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onToggle(producto)}
            disabled={guardando}
            className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-opacity disabled:opacity-50"
            style={{ background: producto.activo ? "#DC2626" : "#16A34A" }}
          >
            {producto.activo ? "Desactivar" : "Activar"}
          </button>
          <button
            type="button"
            onClick={() => onEdit(producto)}
            className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
            style={{ background: "#6B21A8" }}
          >
            Editar
          </button>
        </div>
      </td>
    </tr>
  );
}
