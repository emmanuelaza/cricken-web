"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  emoji: string | null;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  isOpen: boolean;
  pedidosActivos: boolean;
  agregarItem: (item: CartItem) => void;
  eliminarItem: (id: string) => void;
  limpiarCarrito: () => void;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cricken-cart";

export function CartProvider({
  children,
  pedidosActivos = true,
}: {
  children: React.ReactNode;
  pedidosActivos?: boolean;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage al montar.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o corrupto: arrancamos vacíos.
    }
    setHydrated(true);
  }, []);

  // Persistir cambios.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar errores de cuota/privacidad.
    }
  }, [items, hydrated]);

  // Agrega un producto; si ya existe, aumenta la cantidad.
  const agregarItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === item.id);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const eliminarItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const limpiarCarrito = useCallback(() => setItems([]), []);
  const abrirCarrito = useCallback(() => setIsOpen(true), []);
  const cerrarCarrito = useCallback(() => setIsOpen(false), []);

  // Total calculado automáticamente.
  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    [items],
  );
  const count = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      total,
      count,
      isOpen,
      pedidosActivos,
      agregarItem,
      eliminarItem,
      limpiarCarrito,
      abrirCarrito,
      cerrarCarrito,
    }),
    [
      items,
      total,
      count,
      isOpen,
      pedidosActivos,
      agregarItem,
      eliminarItem,
      limpiarCarrito,
      abrirCarrito,
      cerrarCarrito,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
