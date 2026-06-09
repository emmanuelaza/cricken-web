import Link from "next/link";
import { OrderStatusBadge } from "@/components/admin/pedidos/OrderStatusBadge";
import type { Pedido } from "@/data/types";
import { formatPriceCOP } from "@/lib/format";

export function RecentOrders({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: "#111111",
        borderRadius: "12px",
        border: "1px solid rgba(107,33,168,0.2)",
      }}
    >
      <p
        className="px-5 py-4 text-[11px] font-black uppercase tracking-widest"
        style={{ color: "#888888", borderBottom: "1px solid rgba(107,33,168,0.2)" }}
      >
        Pedidos recientes
      </p>

      {pedidos.length === 0 ? (
        <p className="px-5 py-6 text-sm font-bold" style={{ color: "#555555" }}>
          Aún no hay pedidos.
        </p>
      ) : (
        <ul>
          {pedidos.map((p) => (
            <li key={p.id} style={{ borderTop: "1px solid rgba(107,33,168,0.08)" }}>
              <Link
                href={`/admin/pedidos/${p.id}`}
                className="flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-[#222222]"
              >
                <span className="font-display tracking-wide" style={{ color: "#A855F7" }}>
                  CR-{p.id.slice(0, 6).toUpperCase()}
                </span>
                <span className="flex-1 truncate font-bold text-white">
                  {p.cliente_nombre}
                </span>
                <span className="hidden font-bold sm:block" style={{ color: "#888888" }}>
                  {p.sede ?? "🛵 Domicilio"}
                </span>
                <span className="font-black" style={{ color: "#F5C018" }}>
                  {formatPriceCOP(p.total)}
                </span>
                <OrderStatusBadge estado={p.estado} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
