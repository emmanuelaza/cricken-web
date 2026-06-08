"use client";

import { CartButton } from "@/components/Cart/CartButton";
import { CartDrawer } from "@/components/Cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartButton />
      <CartDrawer />
    </CartProvider>
  );
}
