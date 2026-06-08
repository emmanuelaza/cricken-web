"use client";

import { Bell } from "lucide-react";
import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";

// Indicador realtime de pedidos nuevos para la cabecera de /admin/pedidos.
export function NewOrderBell() {
  const { nuevos } = useRealtimeOrders();

  return (
    <div
      className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2"
      style={{ background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.3)" }}
    >
      <Bell size={16} style={{ color: nuevos > 0 ? "#EF4444" : "#888888" }} />
      <span className="text-sm font-bold text-white">
        {nuevos > 0 ? `${nuevos} nuevos` : "Sin nuevos"}
      </span>
      {nuevos > 0 && (
        <span
          className="badge-nuevo absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[11px] font-black text-white"
          style={{ background: "#EF4444" }}
        >
          {nuevos}
        </span>
      )}
    </div>
  );
}
