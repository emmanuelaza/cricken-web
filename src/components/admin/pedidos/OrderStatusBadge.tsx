import type { EstadoPedido } from "@/data/types";
import { estadosPedido } from "@/lib/segmentos";

export function OrderStatusBadge({ estado }: { estado: string }) {
  const e =
    estadosPedido[estado as EstadoPedido] ?? estadosPedido.nuevo;
  return (
    <span
      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wide transition-colors"
      style={{ color: e.color, background: e.bg }}
    >
      {e.label}
    </span>
  );
}
