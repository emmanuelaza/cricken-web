"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import type { Combo, Producto } from "@/data/types";
import { formatCOP } from "@/lib/format";

type Tab = "corndogs" | "combos" | "bebidas" | "salsas";

const TABS: { key: Tab; label: string }[] = [
  { key: "corndogs", label: "🌭 Corn Dogs" },
  { key: "combos", label: "🍟 Combos" },
  { key: "bebidas", label: "🥤 Bebidas" },
  { key: "salsas", label: "🫙 Salsas" },
];

const BEBIDAS = [
  { emoji: "🥤", nombre: "Gaseosa 400 ml" },
  { emoji: "🧴", nombre: "Gaseosa 1.5 Lt" },
];

const SALSAS = [
  { emoji: "🌶️", nombre: "Mayo-Sriracha", desc: "Picante y cremosa" },
  { emoji: "🍖", nombre: "BBQ", desc: "Ahumada y dulce" },
  { emoji: "💛", nombre: "Mostaza", desc: "Tradicional" },
  { emoji: "🧄", nombre: "Ajo Ranch", desc: "Cremosa con notas de ajo" },
];

const RELLENOS = "🧀 Queso · 🌭 Salchicha · 🤝 Combinado";
const SALSAS_DISPONIBLES = "Mayo-Sriracha · BBQ · Mostaza · Ajo Ranch";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "12px",
};

export function MenuDigital({
  productos,
  combos,
}: {
  productos: Producto[];
  combos: Combo[];
}) {
  const [tab, setTab] = useState<Tab>("corndogs");
  const [detalle, setDetalle] = useState<Producto | null>(null);

  return (
    <>
      {/* Tabs */}
      <nav
        className="sticky top-0 z-30 flex overflow-x-auto"
        style={{ background: "#111111" }}
      >
        {TABS.map((t) => {
          const activo = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="shrink-0 px-4 py-3 text-sm font-extrabold transition-colors"
              style={{
                color: activo ? "#F5C018" : "#888888",
                borderBottom: activo
                  ? "2px solid #F5C018"
                  : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-5">
        {tab === "corndogs" && (
          <div style={gridStyle}>
            {productos.map((p) => (
              <ProductoCard key={p.id} producto={p} onClick={() => setDetalle(p)} />
            ))}
          </div>
        )}

        {tab === "combos" && (
          <div className="space-y-3">
            {combos.map((c) => (
              <ComboInfoCard key={c.id} combo={c} />
            ))}
          </div>
        )}

        {tab === "bebidas" && (
          <div style={gridStyle}>
            {BEBIDAS.map((b) => (
              <article
                key={b.nombre}
                className="overflow-hidden rounded-xl"
                style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.2)" }}
              >
                <div
                  className="grid place-items-center"
                  style={{ background: "#111111", aspectRatio: "1 / 1", fontSize: "2.5rem" }}
                >
                  <span aria-hidden>{b.emoji}</span>
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-black text-white">{b.nombre}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "salsas" && (
          <div style={gridStyle}>
            {SALSAS.map((s) => (
              <article
                key={s.nombre}
                className="overflow-hidden rounded-xl"
                style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.2)" }}
              >
                <div
                  className="grid place-items-center"
                  style={{ background: "#111111", aspectRatio: "1 / 1", fontSize: "2.5rem" }}
                >
                  <span aria-hidden>{s.emoji}</span>
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-black text-white">{s.nombre}</p>
                  <p className="mt-0.5 text-[11px]" style={{ color: "#888888" }}>
                    {s.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {detalle && (
        <ProductoDetalle producto={detalle} onClose={() => setDetalle(null)} />
      )}
    </>
  );
}

function ProductoCard({
  producto,
  onClick,
}: {
  producto: Producto;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="overflow-hidden rounded-xl text-left transition-transform active:scale-95"
      style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.2)" }}
    >
      <div
        className="relative grid place-items-center"
        style={{ background: "#111111", aspectRatio: "1 / 1", fontSize: "2.5rem" }}
      >
        <span aria-hidden>{producto.emoji}</span>
        {producto.badge_texto && producto.badge_tipo && (
          <div className="absolute left-2 top-2">
            <Badge texto={producto.badge_texto} tipo={producto.badge_tipo} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[13px] font-black leading-tight text-white">
          {producto.nombre}
        </p>
        {producto.descripcion && (
          <p
            className="mt-0.5 line-clamp-2 text-[11px] leading-snug"
            style={{ color: "#888888" }}
          >
            {producto.descripcion}
          </p>
        )}
        <p
          className="mt-2 font-display leading-none"
          style={{ fontSize: "1.3rem", color: "#F5C018" }}
        >
          {formatCOP(producto.precio)}
        </p>
      </div>
    </button>
  );
}

function ComboInfoCard({ combo }: { combo: Combo }) {
  return (
    <article
      className="p-4"
      style={{
        background: "#1A1A1A",
        borderRadius: "12px",
        border: combo.featured
          ? "1px solid #F5C018"
          : "1px solid rgba(107,33,168,0.2)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#888888" }}>
            {combo.tier}
          </p>
          <h3 className="font-display text-xl tracking-wide text-white">
            {combo.nombre}
          </h3>
        </div>
        <span
          className="font-display leading-none"
          style={{ fontSize: "1.3rem", color: "#F5C018" }}
        >
          {formatCOP(combo.precio)}
        </span>
      </div>
      <ul className="mt-2 space-y-1">
        {combo.combo_items.map((it) => (
          <li key={it.orden} className="text-[13px] font-bold text-white/90">
            · {it.texto}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ProductoDetalle({
  producto,
  onClose,
}: {
  producto: Producto;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-black/70" />

      <div
        role="dialog"
        aria-label={`Detalle de ${producto.nombre}`}
        className="relative z-10 w-full max-w-md p-6"
        style={{
          background: "#111111",
          borderTop: "2px solid #6B21A8",
          borderRadius: "20px 20px 0 0",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-xl"
          style={{ color: "#888888" }}
        >
          ✕
        </button>

        <div className="text-center">
          <span style={{ fontSize: "4rem" }} aria-hidden>
            {producto.emoji}
          </span>
          <h2 className="mt-1 font-display text-3xl tracking-wide text-white">
            {producto.nombre}
          </h2>
          <p
            className="mt-1 font-display leading-none"
            style={{ fontSize: "1.6rem", color: "#F5C018" }}
          >
            {formatCOP(producto.precio)}
          </p>
        </div>

        {producto.descripcion && (
          <p className="mt-4 text-center text-sm font-bold leading-relaxed text-white/90">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-5 space-y-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
              Rellenos disponibles
            </p>
            <p className="mt-1 text-sm font-bold text-white">{RELLENOS}</p>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
              Salsas disponibles
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {SALSAS_DISPONIBLES}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
