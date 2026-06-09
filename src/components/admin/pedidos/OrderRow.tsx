import { OrderStatusBadge } from "@/components/admin/pedidos/OrderStatusBadge";
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

export function OrderRow({
  pedido,
  expanded,
  onToggle,
}: {
  pedido: Pedido;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-[#222222]"
      style={{
        borderTop: "1px solid rgba(107,33,168,0.1)",
        background: expanded ? "#222222" : undefined,
      }}
      onClick={onToggle}
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
        <OrderStatusBadge estado={pedido.estado} />
      </td>
      <td className="px-3 py-3 text-right">
        <span
          className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white"
          style={{ background: "#6B21A8" }}
        >
          {expanded ? "Cerrar" : "Ver"}
        </span>
      </td>
    </tr>
  );
}
