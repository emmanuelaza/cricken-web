"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function CartButton() {
  const { count, abrirCarrito } = useCart();
  const pathname = usePathname();

  // /menu-digital es solo informativo (sin carrito ni pedidos).
  if (pathname?.startsWith("/menu-digital")) return null;

  // Sin productos no mostramos el botón (evita estorbar en /catalogo, etc.).
  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={abrirCarrito}
      aria-label={`Abrir carrito (${count})`}
      className="glow-brand fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-brand text-white transition-transform hover:scale-110"
    >
      <span className="text-2xl" aria-hidden>
        🛒
      </span>
      <span
        className="absolute -right-1 -top-1 grid h-7 min-w-[28px] place-items-center rounded-full px-1.5 text-sm font-black text-white"
        style={{ background: "#EF4444", border: "2px solid #0A0A0A" }}
      >
        {count}
      </span>
    </button>
  );
}
