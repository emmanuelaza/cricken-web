"use client";

import { CartButton } from "@/components/Cart/CartButton";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";

export function Providers({
  children,
  pedidosActivos = true,
}: {
  children: React.ReactNode;
  pedidosActivos?: boolean;
}) {
  return (
    <CartProvider pedidosActivos={pedidosActivos}>
      {children}
      <CartButton />
      <CartDrawer />
    </CartProvider>
  );
}
