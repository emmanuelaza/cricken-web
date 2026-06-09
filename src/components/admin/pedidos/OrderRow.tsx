import Link from "next/link";
import { StatusChanger } from "@/components/admin/pedidos/StatusChanger";
import { TipoBadge } from "@/components/admin/pedidos/TipoBadge";
import type { Pedido } from "@/data/types";
import { formatFecha, formatPriceCOP } from "@/lib/format";

const canalColor: Record<string, string> = {
  web: "#3B82F6",
  whatsapp: "#22C55E",
  rappi: "#F07820",
  didi: "#A855F7",
  presencial: "#888888",
};

export function OrderRow({ pedido }: { pedido: Pedido }) {
  return (
    <tr
      className="transition-colors hover:bg-[#222222]"
      style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}
    >
      <td className="px-3 py-3 font-display tracking-wide" style={{ color: "#A855F7" }}>
        CR-{pedido.id.slice(0, 6).toUpperCase()}
      </td>
      <td className="px-3 py-3 font-bold text-white">{pedido.cliente_nombre}</td>
      <td className="px-3 py-3 font-black" style={{ color: "#F5C018" }}>
        {formatPriceCOP(pedido.total)}
      </td>
      <td className="px-3 py-3">
        <TipoBadge tipo={pedido.tipo_pedido} />
      </td>
      <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>
        {pedido.tipo_pedido === "domicilio"
          ? (pedido.barrio ?? "Domicilio")
          : (pedido.sede ?? "—")}
      </td>
      <td className="px-3 py-3">
        <span
          className="text-xs font-black uppercase"
          style={{ color: canalColor[pedido.canal] ?? "#888888" }}
        >
          {pedido.canal}
        </span>
      </td>
      <td className="px-3 py-3 text-xs font-bold" style={{ color: "#888888" }}>
        {formatFecha(pedido.created_at)}
      </td>
      <td className="px-3 py-3">
        <StatusChanger id={pedido.id} estado={pedido.estado} />
      </td>
      <td className="px-3 py-3 text-right">
        <Link
          href={`/admin/pedidos/${pedido.id}`}
          className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
          style={{ background: "#6B21A8" }}
        >
          Ver
        </Link>
      </td>
    </tr>
  );
}
