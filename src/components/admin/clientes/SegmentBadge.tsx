import type { Segmento } from "@/data/types";
import { segmentos } from "@/lib/segmentos";

export function SegmentBadge({ segmento }: { segmento: Segmento | string }) {
  const s = segmentos[segmento as Segmento] ?? segmentos.nuevo;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wide"
      style={{ color: s.color, background: s.bg }}
    >
      <span aria-hidden>{s.icon}</span>
      {s.label}
    </span>
  );
}
