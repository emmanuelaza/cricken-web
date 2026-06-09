"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import type { NotaCliente } from "@/data/types";
import { formatFecha } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export function NotasClientes({
  clienteId,
  notas: notasIniciales,
}: {
  clienteId: string;
  notas: NotaCliente[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [notas, setNotas] = useState<NotaCliente[]>(notasIniciales);
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);

  const agregar = async () => {
    const t = texto.trim();
    if (!t) return;
    setGuardando(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("notas_clientes")
      .insert({ cliente_id: clienteId, texto: t, autor: user?.email ?? "Admin" })
      .select()
      .single();
    setGuardando(false);
    if (error || !data) {
      toast("No se pudo guardar la nota: " + (error?.message ?? ""), "error");
      return;
    }
    setNotas((prev) => [data as NotaCliente, ...prev]);
    setTexto("");
    toast("Nota agregada ✅", "success");
    router.refresh();
  };

  const eliminar = async (id: string) => {
    const previo = notas;
    setNotas((prev) => prev.filter((n) => n.id !== id));
    const supabase = createClient();
    const { error } = await supabase.from("notas_clientes").delete().eq("id", id);
    if (error) {
      setNotas(previo);
      toast("No se pudo eliminar", "error");
      return;
    }
    toast("Nota eliminada", "info");
    router.refresh();
  };

  return (
    <div
      className="p-5"
      style={{ background: "#111111", borderRadius: "12px", border: "1px solid rgba(107,33,168,0.2)" }}
    >
      <p className="mb-3 text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
        Notas internas
      </p>

      <div className="flex gap-2">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={2}
          placeholder="Ej: Alérgico a la salsa BBQ"
          className="w-full resize-none rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:border-[#A855F7]"
          style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.3)" }}
        />
        <button
          type="button"
          onClick={agregar}
          disabled={guardando}
          className="shrink-0 rounded-lg px-4 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60"
          style={{ background: "#6B21A8" }}
        >
          + Nota
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {notas.length === 0 ? (
          <p className="text-sm font-bold" style={{ color: "#555555" }}>
            Sin notas todavía.
          </p>
        ) : (
          notas.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between gap-3 rounded-lg p-3"
              style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.2)" }}
            >
              <div>
                <p className="text-sm font-bold text-white">“{n.texto}”</p>
                <p className="mt-0.5 text-[11px] font-bold" style={{ color: "#888888" }}>
                  {n.autor ?? "Admin"} · {formatFecha(n.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => eliminar(n.id)}
                aria-label="Eliminar nota"
                className="shrink-0 text-lg"
                style={{ color: "#888888" }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
