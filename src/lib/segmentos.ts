import type { EstadoPedido, Segmento } from "@/data/types";

// Segmentación automática a partir de actividad del cliente.
export function calcularSegmento(
  totalPedidos: number,
  diasDesdeUltimo: number,
): Segmento {
  if (diasDesdeUltimo > 30) return "en_riesgo";
  if (totalPedidos >= 8) return "vip";
  if (totalPedidos >= 3) return "regular";
  return "nuevo";
}

export const segmentos: Record<
  Segmento,
  { color: string; bg: string; label: string; icon: string }
> = {
  vip: { color: "#A855F7", bg: "rgba(168,85,247,0.15)", label: "VIP", icon: "👑" },
  regular: {
    color: "#22C55E",
    bg: "rgba(34,197,94,0.15)",
    label: "Regular",
    icon: "✅",
  },
  nuevo: {
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.15)",
    label: "Nuevo",
    icon: "🆕",
  },
  en_riesgo: {
    color: "#F07820",
    bg: "rgba(240,120,32,0.15)",
    label: "En riesgo",
    icon: "⚠️",
  },
};

export const estadosPedido: Record<
  EstadoPedido,
  { color: string; bg: string; label: string }
> = {
  nuevo: { color: "#EF4444", bg: "rgba(239,68,68,0.15)", label: "Nuevo" },
  confirmado: {
    color: "#F5C018",
    bg: "rgba(245,192,24,0.15)",
    label: "Confirmado",
  },
  entregado: { color: "#22C55E", bg: "rgba(34,197,94,0.15)", label: "Entregado" },
  cancelado: {
    color: "#888888",
    bg: "rgba(136,136,136,0.15)",
    label: "Cancelado",
  },
};

export function diasDesde(fecha: string | null | undefined): number {
  if (!fecha) return Infinity;
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
}

export function etiquetaUltimo(dias: number): string {
  if (!isFinite(dias)) return "—";
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  if (dias < 30) return `${dias} días`;
  return `${dias} días`;
}
