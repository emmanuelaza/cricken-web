"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { OrderForm } from "@/components/Cart/OrderForm";
import { useCart } from "@/context/CartContext";
import { formatCOP } from "@/lib/format";
import { pedidoWhatsappLink } from "@/lib/whatsapp";

export function CartDrawer() {
  const { items, isOpen, total, eliminarItem, cerrarCarrito } = useCart();
  const [mostrarForm, setMostrarForm] = useState(false);
  const pathname = usePathname();

  // /menu-digital es solo informativo (sin carrito ni pedidos).
  if (pathname?.startsWith("/menu-digital")) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={cerrarCarrito}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#111111", borderLeft: "2px solid #6B21A8" }}
      >
        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(107,33,168,0.3)" }}
        >
          <h2 className="font-display text-2xl tracking-wide text-white">
            Tu pedido 🛒
          </h2>
          <button
            type="button"
            onClick={cerrarCarrito}
            aria-label="Cerrar carrito"
            className="grid h-9 w-9 place-items-center rounded-lg text-xl text-muted hover:text-white"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
            <span className="text-5xl" aria-hidden>
              🛒
            </span>
            <p className="font-bold text-muted">Tu carrito está vacío</p>
          </div>
        ) : (
          <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 p-3"
                style={{
                  background: "#0A0A0A",
                  borderRadius: "12px",
                  border: "1px solid rgba(107,33,168,0.25)",
                }}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl"
                  style={{ background: "#1A1A1A" }}
                  aria-hidden
                >
                  {item.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">
                    {item.nombre}
                  </p>
                  <p className="text-xs font-bold text-muted">
                    {item.cantidad} x {formatCOP(item.precio)}
                  </p>
                </div>
                <span className="font-display text-lg leading-none text-yellow">
                  {formatCOP(item.precio * item.cantidad)}
                </span>
                <button
                  type="button"
                  onClick={() => eliminarItem(item.id)}
                  aria-label={`Eliminar ${item.nombre}`}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted hover:text-red-500"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <footer
            className="space-y-3 px-5 py-4"
            style={{ borderTop: "1px solid rgba(107,33,168,0.3)" }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-black uppercase tracking-widest text-muted">
                Total
              </span>
              <span
                className="font-display text-3xl leading-none"
                style={{ color: "#F5C018" }}
              >
                {formatCOP(total)}
              </span>
            </div>

            <a
              href={pedidoWhatsappLink(items, total)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-lg bg-yellow py-3 text-sm font-black uppercase tracking-wide text-bg transition-transform hover:scale-[1.02]"
            >
              Pedir por WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setMostrarForm(true)}
              className="flex w-full items-center justify-center rounded-lg bg-brand py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-brand-light"
            >
              Enviar pedido
            </button>
          </footer>
        )}
      </aside>

      {mostrarForm && <OrderForm cerrarModal={() => setMostrarForm(false)} />}
    </>
  );
}
