"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import { useCart } from "@/context/CartContext";
import type { Producto } from "@/data/types";
import { formatCOP } from "@/lib/format";

const categoriaLabel: Record<Producto["categoria"], string> = {
  salado: "Salado",
  dulce: "Dulce",
  picante: "Picante",
  especial: "Especial",
};

export function ProductCard({ producto }: { producto: Producto }) {
  const { agregarItem, pedidosActivos } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAdd = () => {
    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      emoji: producto.emoji,
      cantidad: 1,
    });
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="card-cricken group flex flex-col overflow-hidden">
      {/* Área del emoji con overlay inferior */}
      <div className="relative grid h-32 place-items-center overflow-hidden" style={{ background: "#1A1A1A" }}>
        {producto.foto_url ? (
          <Image
            src={producto.foto_url}
            alt={producto.nombre}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span
            className="text-6xl transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          >
            {producto.emoji}
          </span>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{
            background: "linear-gradient(to top, #111111 0%, transparent 100%)",
          }}
        />
        {producto.badge_texto && producto.badge_tipo && (
          <div className="absolute left-3 top-3">
            <Badge texto={producto.badge_texto} tipo={producto.badge_tipo} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-black leading-tight text-white">
            {producto.nombre}
          </h3>
          <span className="shrink-0 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-muted">
            {categoriaLabel[producto.categoria]}
          </span>
        </div>

        {producto.descripcion && (
          <p className="mt-1.5 flex-1 text-sm font-bold leading-snug text-muted">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-2xl leading-none text-yellow">
            {formatCOP(producto.precio)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!pedidosActivos}
            aria-label={`Agregar ${producto.nombre} al carrito`}
            className={`grid h-[30px] w-[30px] place-items-center rounded-lg text-lg font-black text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              added ? "bg-green-500" : "bg-brand hover:bg-brand-light"
            }`}
          >
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
}
