"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import type { Combo } from "@/data/types";
import { createClient } from "@/lib/supabase/client";

export function EditComboModal({
  combo,
  onClose,
}: {
  combo: Combo | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const esNuevo = !combo;

  const [tier, setTier] = useState(combo?.tier ?? "");
  const [nombre, setNombre] = useState(combo?.nombre ?? "");
  const [precio, setPrecio] = useState(String(combo?.precio ?? 0));
  const [precioLabel, setPrecioLabel] = useState(combo?.precio_label ?? "");
  const [featured, setFeatured] = useState(combo?.featured ?? false);
  const [items, setItems] = useState<string[]>(
    combo?.combo_items?.map((i) => i.texto) ?? [""],
  );
  const [guardando, setGuardando] = useState(false);

  const setItem = (i: number, v: string) =>
    setItems((prev) => prev.map((t, idx) => (idx === i ? v : t)));
  const addItem = () => setItems((prev) => [...prev, ""]);
  const delItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const guardar = async () => {
    setGuardando(true);
    const supabase = createClient();
    const fila = {
      tier: tier.trim(),
      nombre: nombre.trim(),
      precio: parseInt(precio, 10) || 0,
      precio_label: precioLabel.trim() || null,
      featured,
    };

    let comboId = combo?.id;
    if (esNuevo) {
      const { data, error } = await supabase
        .from("combos")
        .insert({ ...fila, activo: true })
        .select("id")
        .single();
      if (error || !data) {
        setGuardando(false);
        toast("No se pudo crear: " + (error?.message ?? ""), "error");
        return;
      }
      comboId = data.id;
    } else {
      const { error } = await supabase
        .from("combos")
        .update(fila)
        .eq("id", combo!.id);
      if (error) {
        setGuardando(false);
        toast("No se pudo guardar: " + error.message, "error");
        return;
      }
    }

    // Re-sincroniza los items: borra y vuelve a insertar.
    const limpios = items.map((t) => t.trim()).filter(Boolean);
    await supabase.from("combo_items").delete().eq("combo_id", comboId!);
    if (limpios.length > 0) {
      await supabase.from("combo_items").insert(
        limpios.map((texto, idx) => ({
          combo_id: comboId,
          texto,
          orden: idx + 1,
        })),
      );
    }

    setGuardando(false);
    toast(esNuevo ? "Combo creado" : "Combo actualizado", "success");
    onClose();
    router.refresh();
  };

  const inputBase =
    "w-full rounded-lg px-3 py-2 font-bold text-white outline-none transition-colors focus:border-[#A855F7]";
  const inputStyle = {
    background: "#1A1A1A",
    border: "1px solid rgba(107,33,168,0.3)",
  } as const;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-label="Editar combo"
        className="admin-scroll relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto p-6"
        style={{
          background: "#111111",
          borderRadius: "12px",
          border: "1px solid rgba(107,33,168,0.5)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-white">
            {esNuevo ? "Nuevo combo" : "Editar combo"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-lg" style={{ color: "#888888" }}>
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <Field label="Tier">
            <input value={tier} onChange={(e) => setTier(e.target.value)} placeholder="Para 2 personas" className={inputBase} style={inputStyle} />
          </Field>
          <Field label="Nombre">
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="PAREJA" className={inputBase} style={inputStyle} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio">
              <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className={inputBase} style={inputStyle} />
            </Field>
            <Field label="Label precio">
              <input value={precioLabel} onChange={(e) => setPrecioLabel(e.target.value)} placeholder="$21.500 por persona" className={inputBase} style={inputStyle} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured (mejor valor)
          </label>

          <div>
            <p className="mb-1 text-[11px] font-black uppercase tracking-wide" style={{ color: "#888888" }}>
              Items del combo
            </p>
            <div className="space-y-2">
              {items.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={t}
                    onChange={(e) => setItem(i, e.target.value)}
                    placeholder="1 perro coreano a elegir"
                    className={inputBase}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => delItem(i)}
                    aria-label="Quitar item"
                    className="shrink-0 rounded-lg px-3 text-white"
                    style={{ background: "#DC2626" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wide"
              style={{ color: "#A855F7", border: "1px solid rgba(107,33,168,0.4)" }}
            >
              + Agregar item
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide" style={{ color: "#888888", border: "1px solid #333333" }}>
            Cancelar
          </button>
          <button type="button" onClick={guardar} disabled={guardando} className="rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60" style={{ background: "#6B21A8" }}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-black uppercase tracking-wide" style={{ color: "#888888" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
