"use client";

import { MessageCircle } from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/pedidos/OrderStatusBadge";
import { TipoBadge } from "@/components/admin/pedidos/TipoBadge";
import type { EstadoPedido, Pedido } from "@/data/types";
import { formatFecha, formatPriceCOP } from "@/lib/format";

const acciones: { estado: EstadoPedido; label: string; color: string }[] = [
  { estado: "confirmado", label: "Confirmar", color: "#F5C018" },
  { estado: "entregado", label: "Entregado", color: "#22C55E" },
  { estado: "cancelado", label: "Cancelar", color: "#EF4444" },
];

export function ExpandedOrderDetail({
  pedido,
  guardando,
  onEstado,
}: {
  pedido: Pedido;
  guardando: boolean;
  onEstado: (nuevo: EstadoPedido) => void;
}) {
  const tel = (pedido.cliente_telefono ?? "").replace(/\D/g, "");
  const waHref = `https://wa.me/${tel.startsWith("57") ? tel : "57" + tel}`;

  return (
    <div
      className="admin-scroll"
      style={{
        background: "#1A1A1A",
        borderRadius: "0 0 12px 12px",
        padding: "1.5rem",
        paddingBottom: 0,
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
      }}
    >
      <div style={{ paddingBottom: "2rem" }}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-display text-xl tracking-wide text-white">
            Pedido CR-{pedido.id.slice(0, 6).toUpperCase()}
          </span>
          <TipoBadge tipo={pedido.tipo_pedido} />
          <OrderStatusBadge estado={pedido.estado} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Cliente */}
          <div>
            <p
              className="mb-2 text-[11px] font-black uppercase tracking-widest"
              style={{ color: "#888888" }}
            >
              Cliente
            </p>
            <p className="font-bold text-white">{pedido.cliente_nombre}</p>
            <div className="mt-1.5 space-y-1 text-sm font-bold text-white/90">
              <p>📱 {pedido.cliente_telefono}</p>
              {pedido.tipo_pedido === "domicilio" ? (
                <>
                  <p>🛵 {pedido.direccion}</p>
                  <p>🏘️ {pedido.barrio}, Medellín</p>
                </>
              ) : (
                <p>📍 Recoger en: {pedido.sede}</p>
              )}
              <p className="capitalize">📦 Canal: {pedido.canal}</p>
              <p style={{ color: "#888888" }}>🕐 {formatFecha(pedido.created_at)}</p>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide text-white"
              style={{ background: "#22C55E" }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>

          {/* Productos */}
          <div>
            <p
              className="mb-2 text-[11px] font-black uppercase tracking-widest"
              style={{ color: "#888888" }}
            >
              Pedido
            </p>
            <ul className="space-y-1.5">
              {pedido.productos.map((p, i) => (
                <li
                  key={`${p.nombre}-${i}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="font-bold text-white">
                    {p.cantidad}x {p.nombre}
                  </span>
                  <span className="font-bold" style={{ color: "#888888" }}>
                    {formatPriceCOP(p.precio * p.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
            <div
              className="mt-3 flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid rgba(107,33,168,0.2)" }}
            >
              <span
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: "#888888" }}
              >
                Total
              </span>
              <span
                className="font-display text-2xl leading-none"
                style={{ color: "#F5C018" }}
              >
                {formatPriceCOP(pedido.total)}
              </span>
            </div>
            {pedido.notas && (
              <p
                className="mt-3 rounded-lg p-3 text-sm font-bold text-white/90"
                style={{ background: "#111111" }}
              >
                📝 {pedido.notas}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Acciones sticky */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          marginInline: "-1.5rem",
          background: "#111111",
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(107,33,168,0.3)",
        }}
      >
        <div className="flex flex-wrap gap-2">
          {acciones.map((a) => {
            const actual = pedido.estado === a.estado;
            return (
              <button
                key={a.estado}
                type="button"
                disabled={guardando || actual}
                onClick={() => onEstado(a.estado)}
                className="flex-1 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wide transition-opacity disabled:opacity-40"
                style={{ background: a.color, color: a.estado === "confirmado" ? "#0A0A0A" : "#FFFFFF" }}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
