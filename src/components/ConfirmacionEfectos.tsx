"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

// Vacía el carrito al llegar a la confirmación y muestra el check animado.
export function ConfirmacionEfectos() {
  const { limpiarCarrito } = useCart();

  useEffect(() => {
    limpiarCarrito();
  }, [limpiarCarrito]);

  return (
    <div
      className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full text-4xl"
      style={{ background: "#22C55E", boxShadow: "0 0 40px rgba(34,197,94,0.5)" }}
      aria-hidden
    >
      ✅
    </div>
  );
}
