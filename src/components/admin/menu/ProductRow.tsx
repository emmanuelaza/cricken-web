"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/Badge";
import { useToast } from "@/components/admin/Toast";
import type { Producto } from "@/data/types";
import { formatPriceCOP } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export function ProductRow({
  producto,
  onEdit,
}: {
  producto: Producto;
  onEdit: (p: Producto) => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [activo, setActivo] = useState(producto.activo);
  const [guardando, setGuardando] = useState(false);

  const toggle = async () => {
    const nuevo = !activo;
    setActivo(nuevo);
    setGuardando(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("productos")
      .update({ activo: nuevo })
      .eq("id", producto.id);
    setGuardando(false);
    if (error) {
      setActivo(!nuevo);
      toast("No se pudo cambiar: " + error.message, "error");
      return;
    }
    toast(`${producto.nombre} ${nuevo ? "activado" : "desactivado"}`, "success");
    router.refresh();
  };

  return (
    <tr
      className="transition-colors hover:bg-[#222222]"
      style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}
    >
      <td className="px-3 py-3">
        <button
          type="button"
          onClick={toggle}
          disabled={guardando}
          aria-label={activo ? "Desactivar" : "Activar"}
          className="text-lg"
        >
          {activo ? "✅" : "🔴"}
        </button>
      </td>
      <td className="px-3 py-3 text-xl">{producto.emoji}</td>
      <td className="px-3 py-3 font-bold text-white">{producto.nombre}</td>
      <td className="px-3 py-3 font-bold capitalize" style={{ color: "#888888" }}>
        {producto.categoria}
      </td>
      <td className="px-3 py-3 font-black" style={{ color: "#F5C018" }}>
        {formatPriceCOP(producto.precio)}
      </td>
      <td className="px-3 py-3">
        {producto.badge_texto && producto.badge_tipo ? (
          <Badge texto={producto.badge_texto} tipo={producto.badge_tipo} />
        ) : (
          <span style={{ color: "#555555" }}>—</span>
        )}
      </td>
      <td className="px-3 py-3 text-right">
        <button
          type="button"
          onClick={() => onEdit(producto)}
          className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
          style={{ background: "#6B21A8" }}
        >
          Editar
        </button>
      </td>
    </tr>
  );
}
