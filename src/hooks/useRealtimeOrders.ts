"use client";

import { useCallback, useEffect, useState } from "react";
import type { Pedido } from "@/data/types";
import { createClient } from "@/lib/supabase/client";

// Cuenta de pedidos nuevos + suscripción Realtime para el badge del sidebar.
export function useRealtimeOrders() {
  const [nuevos, setNuevos] = useState(0);
  const [ultimoPedido, setUltimoPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Conteo inicial de pedidos en estado 'nuevo'.
    supabase
      .from("pedidos")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nuevo")
      .then(({ count }) => setNuevos(count ?? 0));

    // Suscripción a inserciones en tiempo real.
    const channel = supabase
      .channel("pedidos-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pedidos" },
        (payload) => {
          setNuevos((prev) => prev + 1);
          setUltimoPedido(payload.new as Pedido);
          const audio = new Audio("/sounds/notification.wav");
          audio.play().catch(() => {
            // Autoplay bloqueado: ignoramos.
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const marcarVistos = useCallback(() => setNuevos(0), []);

  return { nuevos, ultimoPedido, marcarVistos };
}
