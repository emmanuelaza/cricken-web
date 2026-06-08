"use client";

import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { SegmentBadge } from "@/components/admin/clientes/SegmentBadge";
import { OrderStatusBadge } from "@/components/admin/pedidos/OrderStatusBadge";
import type { ClienteConPedidos } from "@/lib/admin-data";
import { formatFecha, formatPriceCOP } from "@/lib/format";
import { calcularSegmento, diasDesde } from "@/lib/segmentos";

const panel = {
  background: "#111111",
  borderRadius: "12px",
  border: "1px solid rgba(107,33,168,0.2)",
} as const;

export function ClientDetail({ cliente }: { cliente: ClienteConPedidos }) {
  const pedidos = [...(cliente.pedidos ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const dias = diasDesde(cliente.updated_at ?? cliente.created_at);
  const segmento = calcularSegmento(cliente.total_pedidos ?? 0, dias);
  const ticket =
    cliente.total_pedidos > 0
      ? Math.round(cliente.total_gastado / cliente.total_pedidos)
      : 0;

  // Productos favoritos
  const conteo = new Map<string, number>();
  for (const p of cliente.pedidos ?? []) {
    for (const it of p.productos ?? [])
      conteo.set(it.nombre, (conteo.get(it.nombre) ?? 0) + it.cantidad);
  }
  const favoritos = [...conteo.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([n]) => n);

  const tel = (cliente.telefono ?? "").replace(/\D/g, "");
  const waHref = `https://wa.me/${tel.startsWith("57") ? tel : "57" + tel}`;
  const rating = Math.round(cliente.rating_promedio ?? 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wide"
          style={{ color: "#888888" }}
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl tracking-wide text-white">
            {cliente.nombre}
          </h2>
          <SegmentBadge segmento={segmento} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        {/* Info */}
        <div className="p-5" style={panel}>
          <p className="mb-3 text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
            Info
          </p>
          <div className="space-y-1.5 text-sm font-bold text-white/90">
            <p>📱 {cliente.telefono ?? "—"}</p>
            {cliente.email && <p>📧 {cliente.email}</p>}
            <p>📍 {cliente.sede_favorita ?? "—"}</p>
          </div>
          {tel && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white"
              style={{ background: "#22C55E" }}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
        </div>

        {/* Métricas */}
        <div className="p-5" style={panel}>
          <p className="mb-4 text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
            Métricas
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Metric label="Pedidos" valor={`${cliente.total_pedidos ?? 0}`} />
            <Metric label="Gastado" valor={formatPriceCOP(cliente.total_gastado ?? 0)} amarillo />
            <Metric label="Ticket prom." valor={formatPriceCOP(ticket)} />
          </div>
          {rating > 0 && (
            <p className="mt-3 text-lg" style={{ color: "#F5C018" }}>
              {"★".repeat(rating)}
              <span style={{ color: "#333333" }}>{"★".repeat(5 - rating)}</span>
            </p>
          )}
          {favoritos.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
                Productos favoritos
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {favoritos.join(" · ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="overflow-hidden" style={panel}>
        <p
          className="px-5 py-4 text-[11px] font-black uppercase tracking-widest"
          style={{ color: "#888888", borderBottom: "1px solid rgba(107,33,168,0.2)" }}
        >
          Historial de pedidos
        </p>
        {pedidos.length === 0 ? (
          <p className="px-5 py-6 text-sm font-bold" style={{ color: "#555555" }}>
            Sin pedidos registrados.
          </p>
        ) : (
          <ul>
            {pedidos.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 px-5 py-3 text-sm"
                style={{ borderTop: "1px solid rgba(107,33,168,0.08)" }}
              >
                <span className="font-display tracking-wide" style={{ color: "#A855F7" }}>
                  CR-{p.id.slice(0, 6).toUpperCase()}
                </span>
                <span className="hidden font-bold sm:block" style={{ color: "#888888" }}>
                  {formatFecha(p.created_at)}
                </span>
                <span className="flex-1 truncate font-bold text-white">
                  {(p.productos ?? [])
                    .map((it) => `${it.cantidad}x ${it.nombre}`)
                    .join(", ")}
                </span>
                <span className="font-black" style={{ color: "#F5C018" }}>
                  {formatPriceCOP(p.total)}
                </span>
                <OrderStatusBadge estado={p.estado} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  valor,
  amarillo,
}: {
  label: string;
  valor: string;
  amarillo?: boolean;
}) {
  return (
    <div>
      <p className="font-display text-2xl leading-none" style={{ color: amarillo ? "#F5C018" : "#FFFFFF" }}>
        {valor}
      </p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: "#888888" }}>
        {label}
      </p>
    </div>
  );
}
