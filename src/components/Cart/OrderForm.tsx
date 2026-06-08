"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCOP } from "@/lib/format";
import { sedesFallback } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

export function OrderForm({ cerrarModal }: { cerrarModal: () => void }) {
  const router = useRouter();
  // cerrarCarrito() del contexto cierra el drawer (el estado isOpen vive ahí
  // para que el botón flotante pueda abrirlo).
  const { items, total, limpiarCarrito, cerrarCarrito: cerrarDrawer } = useCart();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [sede, setSede] = useState<string>(sedesFallback[0]);
  const [notas, setNotas] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !telefono.trim()) {
      setError("Nombre y teléfono son obligatorios.");
      return;
    }

    setEnviando(true);

    const carrito = items.map((i) => ({
      nombre: i.nombre,
      precio: i.precio,
      cantidad: i.cantidad,
    }));
    const nota = notas.trim() || null;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        cliente_nombre: nombre,
        cliente_telefono: telefono,
        sede: sede,
        productos: carrito,
        total: total,
        estado: "nuevo",
        canal: "web",
        notas: nota,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Error al enviar pedido: " + error.message);
      setEnviando(false);
      return;
    }

    // Flujo de cierre antes de redirigir (en este orden):
    cerrarModal(); // 1. cierra el modal del formulario
    cerrarDrawer(); // 2. cierra el drawer del carrito
    limpiarCarrito(); // 3. vacía el carrito
    router.push("/confirmacion?id=" + data.id); // 4. redirige a la confirmación
  };

  const inputBase =
    "w-full rounded-lg bg-bg px-4 py-3 font-bold text-white placeholder:text-muted outline-none transition-colors focus:border-brand-light";
  const inputStyle = { border: "1px solid rgba(107,33,168,0.3)" } as const;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div onClick={cerrarModal} aria-hidden className="absolute inset-0 bg-black/70" />

      <div
        role="dialog"
        aria-label="Formulario de pedido"
        className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto p-6"
        style={{
          background: "#111111",
          borderRadius: "16px",
          border: "1px solid #6B21A8",
          boxShadow: "0 0 40px rgba(107,33,168,0.35)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-white">
            Confirma tu pedido
          </h2>
          <button
            type="button"
            onClick={cerrarModal}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-lg text-xl text-muted hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-black uppercase tracking-wide text-muted">
              Nombre completo *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className={inputBase}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black uppercase tracking-wide text-muted">
              Teléfono *
            </label>
            <input
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="300 000 0000"
              className={inputBase}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black uppercase tracking-wide text-muted">
              Sede para recoger *
            </label>
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className={inputBase}
              style={inputStyle}
            >
              {sedesFallback.map((s) => (
                <option key={s} value={s} className="bg-bg">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-black uppercase tracking-wide text-muted">
              Nota (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Sin cebolla, extra salsa, etc."
              rows={2}
              className={`${inputBase} resize-none`}
              style={inputStyle}
            />
          </div>

          {/* Resumen readonly */}
          <div
            className="space-y-2 rounded-lg p-4"
            style={{ background: "#0A0A0A", border: "1px solid rgba(107,33,168,0.25)" }}
          >
            <p className="text-sm font-black uppercase tracking-wide text-muted">
              Resumen
            </p>
            <ul className="space-y-1">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="font-bold text-white/90">
                    {i.cantidad}x {i.nombre}
                  </span>
                  <span className="shrink-0 font-bold text-muted">
                    {formatCOP(i.precio * i.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
              <span className="text-sm font-black uppercase tracking-widest text-muted">
                Total
              </span>
              <span
                className="font-display text-2xl leading-none"
                style={{ color: "#F5C018" }}
              >
                {formatCOP(total)}
              </span>
            </div>
          </div>

          {error && (
            <p
              className="rounded-lg px-4 py-3 text-sm font-bold text-red-300"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.4)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center rounded-lg bg-yellow py-3.5 text-base font-black uppercase tracking-wide text-bg transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {enviando ? "Enviando…" : "Confirmar pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
