"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { EditComboModal } from "@/components/admin/combos/EditComboModal";
import { useToast } from "@/components/admin/Toast";
import type { Combo } from "@/data/types";
import { formatPriceCOP } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export function CombosTable({ combos: combosProp }: { combos: Combo[] }) {
  const toast = useToast();
  const [lista, setLista] = useState<Combo[]>(combosProp);
  const [editando, setEditando] = useState<Combo | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  useEffect(() => setLista(combosProp), [combosProp]);

  const toggleActivo = async (combo: Combo) => {
    const nuevo = !combo.activo;
    setGuardandoId(combo.id);
    setLista((prev) =>
      prev.map((c) => (c.id === combo.id ? { ...c, activo: nuevo } : c)),
    );
    const supabase = createClient();
    const { error } = await supabase
      .from("combos")
      .update({ activo: nuevo })
      .eq("id", combo.id);
    setGuardandoId(null);
    if (error) {
      setLista((prev) =>
        prev.map((c) => (c.id === combo.id ? { ...c, activo: combo.activo } : c)),
      );
      toast("No se pudo cambiar: " + error.message, "error");
      return;
    }
    toast(nuevo ? "Combo activado ✅" : "Combo desactivado 🔴", nuevo ? "success" : "error");
  };

  const abrir = (c: Combo | null) => {
    setEditando(c);
    setModalAbierto(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => abrir(null)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
          style={{ background: "#6B21A8" }}
        >
          <Plus size={16} /> Nuevo combo
        </button>
      </div>

      <div
        className="admin-scroll overflow-x-auto"
        style={{ background: "#111111", borderRadius: "12px", border: "1px solid rgba(107,33,168,0.2)" }}
      >
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr style={{ color: "#555555" }}>
              {["Nombre", "Tier", "Precio", "Items", "Featured", "Activo", "Acciones"].map((h) => (
                <th key={h} className={`px-3 py-3 text-[11px] font-black uppercase tracking-widest ${h === "Acciones" ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-[#222222]" style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}>
                <td className="px-3 py-3 font-display text-lg tracking-wide text-white">{c.nombre}</td>
                <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>{c.tier}</td>
                <td className="px-3 py-3 font-black" style={{ color: "#F5C018" }}>{formatPriceCOP(c.precio)}</td>
                <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>{c.combo_items?.length ?? 0} items</td>
                <td className="px-3 py-3">{c.featured ? "⭐" : "—"}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActivo(c)}
                    disabled={guardandoId === c.id}
                    className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-opacity disabled:opacity-50"
                    style={{ background: c.activo ? "#DC2626" : "#16A34A" }}
                  >
                    {c.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => abrir(c)}
                    className="rounded-md px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
                    style={{ background: "#6B21A8" }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lista.length === 0 && (
          <p className="px-5 py-8 text-center text-sm font-bold" style={{ color: "#555555" }}>
            No hay combos. Crea el primero con “Nuevo combo”.
          </p>
        )}
      </div>

      {modalAbierto && <EditComboModal combo={editando} onClose={() => setModalAbierto(false)} />}
    </div>
  );
}
