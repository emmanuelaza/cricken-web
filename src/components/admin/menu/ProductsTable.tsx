"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { EditProductModal } from "@/components/admin/menu/EditProductModal";
import { ProductRow } from "@/components/admin/menu/ProductRow";
import { useToast } from "@/components/admin/Toast";
import type { Combo, Producto } from "@/data/types";
import { formatPriceCOP } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export function ProductsTable({
  productos: productosProp,
  combos = [],
}: {
  productos: Producto[];
  combos?: Combo[];
}) {
  const toast = useToast();
  const [lista, setLista] = useState<Producto[]>(productosProp);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  // Re-sincroniza cuando el server vuelve a enviar datos (p.ej. tras editar).
  useEffect(() => {
    setLista(productosProp);
  }, [productosProp]);

  const abrirNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };
  const abrirEditar = (p: Producto) => {
    setEditando(p);
    setModalAbierto(true);
  };

  // Toggle activo/inactivo: actualiza el estado local al instante (sin refresh,
  // porque la RLS de lectura oculta los inactivos) y persiste en Supabase.
  const toggleActivo = async (producto: Producto) => {
    const nuevo = !producto.activo;
    setGuardandoId(producto.id);
    setLista((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, activo: nuevo } : p)),
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("productos")
      .update({ activo: nuevo })
      .eq("id", producto.id);
    console.log("Resultado:", error);
    setGuardandoId(null);

    if (error) {
      // revertir
      setLista((prev) =>
        prev.map((p) =>
          p.id === producto.id ? { ...p, activo: producto.activo } : p,
        ),
      );
      toast("No se pudo cambiar: " + error.message, "error");
      return;
    }

    toast(
      nuevo ? "Producto activado ✅" : "Producto desactivado 🔴",
      nuevo ? "success" : "error",
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
          style={{ background: "#6B21A8" }}
        >
          <Plus size={16} /> Agregar producto
        </button>
      </div>

      <div
        className="admin-scroll overflow-x-auto"
        style={{
          background: "#111111",
          borderRadius: "12px",
          border: "1px solid rgba(107,33,168,0.2)",
        }}
      >
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr style={{ color: "#555555" }}>
              {["", "Nombre", "Categoría", "Precio", "Badge", "Acciones"].map(
                (h, i) => (
                  <th
                    key={i}
                    className={`px-3 py-3 text-[11px] font-black uppercase tracking-widest ${
                      h === "Acciones" ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <ProductRow
                key={p.id}
                producto={p}
                guardando={guardandoId === p.id}
                onEdit={abrirEditar}
                onToggle={toggleActivo}
              />
            ))}
          </tbody>
        </table>

        {lista.length === 0 && (
          <p
            className="px-5 py-8 text-center text-sm font-bold"
            style={{ color: "#555555" }}
          >
            No hay productos. Crea el primero o corre el seed en Supabase.
          </p>
        )}
      </div>

      {/* Combos (solo lectura) */}
      {combos.length > 0 && (
        <div>
          <p
            className="mb-2 mt-2 text-[11px] font-black uppercase tracking-widest"
            style={{ color: "#888888" }}
          >
            Combos
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((c) => (
              <div
                key={c.id}
                className="p-4"
                style={{
                  background: "#111111",
                  borderRadius: "12px",
                  border: "1px solid rgba(107,33,168,0.2)",
                }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg tracking-wide text-white">
                    {c.nombre}
                  </h3>
                  <span className="font-black" style={{ color: "#F5C018" }}>
                    {formatPriceCOP(c.precio)}
                  </span>
                </div>
                <p className="text-[11px] font-bold uppercase" style={{ color: "#555555" }}>
                  {c.tier}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {c.combo_items.map((it) => (
                    <li key={it.orden} className="text-xs font-bold text-white/80">
                      · {it.texto}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalAbierto && (
        <EditProductModal
          producto={editando}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}
