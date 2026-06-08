"use client";

import { useRouter } from "next/navigation";
import { SegmentBadge } from "@/components/admin/clientes/SegmentBadge";
import type { Cliente } from "@/data/types";
import { formatPriceCOP } from "@/lib/format";
import {
  calcularSegmento,
  diasDesde,
  etiquetaUltimo,
} from "@/lib/segmentos";

export function ClientRow({ cliente }: { cliente: Cliente }) {
  const router = useRouter();
  const dias = diasDesde(cliente.updated_at ?? cliente.created_at);
  const segmento = calcularSegmento(cliente.total_pedidos ?? 0, dias);

  return (
    <tr
      onClick={() => router.push(`/admin/clientes/${cliente.id}`)}
      className="cursor-pointer transition-colors hover:bg-[#222222]"
      style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}
    >
      <td className="px-3 py-3 font-bold text-white">{cliente.nombre}</td>
      <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>
        {cliente.telefono ?? "—"}
      </td>
      <td className="px-3 py-3 text-center font-black text-white">
        {cliente.total_pedidos ?? 0}
      </td>
      <td className="px-3 py-3 font-black" style={{ color: "#F5C018" }}>
        {formatPriceCOP(cliente.total_gastado ?? 0)}
      </td>
      <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>
        {cliente.sede_favorita ?? "—"}
      </td>
      <td className="px-3 py-3">
        <SegmentBadge segmento={segmento} />
      </td>
      <td className="px-3 py-3 text-xs font-bold" style={{ color: "#888888" }}>
        {etiquetaUltimo(dias)}
      </td>
    </tr>
  );
}
