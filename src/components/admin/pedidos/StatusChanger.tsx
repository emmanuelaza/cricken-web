"use client";

import { useState } from "react";
import { OrderStatusBadge } from "@/components/admin/pedidos/OrderStatusBadge";
import { useToast } from "@/components/admin/Toast";
import type { EstadoPedido } from "@/data/types";
import { createClient } from "@/lib/supabase/client";

const opciones: { estado: EstadoPedido; label: string; color: string }[] = [
  { estado: "confirmado", label: "Confirmar pedido", color: "#F5C018" },
  { estado: "entregado", label: "Marcar entregado", color: "#22C55E" },
  { estado: "cancelado", label: "Cancelar", color: "#EF4444" },
];

export function StatusChanger({
  id,
  estado: estadoInicial,
}: {
  id: string;
  estado: string;
}) {
  const toast = useToast();
  const [estado, setEstado] = useState(estadoInicial);
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cambiar = async (nuevo: EstadoPedido) => {
    setOpen(false);
    if (nuevo === estado) return;
    const previo = estado;
    setEstado(nuevo);
    setGuardando(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: nuevo })
      .eq("id", id);
    setGuardando(false);

    if (error) {
      setEstado(previo);
      toast("No se pudo actualizar el estado", "error");
      return;
    }
    toast(`Pedido CR-${id.slice(0, 6).toUpperCase()} → ${nuevo}`, "success");
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={guardando}
        className="cursor-pointer disabled:opacity-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <OrderStatusBadge estado={estado} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1 w-44 overflow-hidden py-1"
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(107,33,168,0.4)",
              borderRadius: "10px",
              boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
            }}
          >
            {opciones.map((o) => (
              <button
                key={o.estado}
                type="button"
                onClick={() => cambiar(o.estado)}
                className="block w-full px-3 py-2 text-left text-sm font-bold transition-colors hover:bg-[#222222]"
                style={{ color: o.color }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
