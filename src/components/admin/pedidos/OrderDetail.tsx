"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { StatusChanger } from "@/components/admin/pedidos/StatusChanger";
import type { Pedido } from "@/data/types";
import { formatFecha, formatPriceCOP } from "@/lib/format";

export function OrderDetail({ pedido }: { pedido: Pedido }) {
  const numero = `CR-${pedido.id.slice(0, 6).toUpperCase()}`;
  const tel = (pedido.cliente_telefono ?? "").replace(/\D/g, "");
  const waHref = `https://wa.me/${tel.startsWith("57") ? tel : "57" + tel}?text=${encodeURIComponent(
    `¡Hola ${pedido.cliente_nombre}! Sobre tu pedido ${numero} en Cricken 🌭`,
  )}`;

  const panel = {
    background: "#111111",
    borderRadius: "12px",
    border: "1px solid rgba(107,33,168,0.2)",
  } as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wide"
          style={{ color: "#888888" }}
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl tracking-wide text-white">
            Pedido {numero}
          </h2>
          <StatusChanger id={pedido.id} estado={pedido.estado} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Cliente */}
        <div className="p-5" style={panel}>
          <p
            className="mb-3 text-[11px] font-black uppercase tracking-widest"
            style={{ color: "#888888" }}
          >
            Cliente
          </p>
          <p className="font-display text-2xl tracking-wide text-white">
            {pedido.cliente_nombre}
          </p>
          <div className="mt-3 space-y-1.5 text-sm font-bold text-white/90">
            <p>📱 {pedido.cliente_telefono}</p>
            <p>📍 {pedido.sede}</p>
            <p className="capitalize">🛵 Canal: {pedido.canal}</p>
            <p style={{ color: "#888888" }}>🕐 {formatFecha(pedido.created_at)}</p>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white"
            style={{ background: "#22C55E" }}
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>

        {/* Pedido */}
        <div className="p-5" style={panel}>
          <p
            className="mb-3 text-[11px] font-black uppercase tracking-widest"
            style={{ color: "#888888" }}
          >
            Pedido
          </p>
          <ul className="space-y-2">
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
            className="mt-4 flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(107,33,168,0.2)" }}
          >
            <span
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: "#888888" }}
            >
              Total
            </span>
            <span className="font-display text-3xl leading-none" style={{ color: "#F5C018" }}>
              {formatPriceCOP(pedido.total)}
            </span>
          </div>
          {pedido.notas && (
            <p
              className="mt-4 rounded-lg p-3 text-sm font-bold text-white/90"
              style={{ background: "#1A1A1A" }}
            >
              📝 {pedido.notas}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
