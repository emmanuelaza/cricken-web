import type { BadgeTipo } from "@/data/types";

const styles: Record<BadgeTipo, string> = {
  yellow: "bg-yellow/15 text-yellow ring-yellow/40",
  purple: "bg-brand/25 text-brand-light ring-brand/50",
};

export function Badge({ texto, tipo }: { texto: string; tipo: BadgeTipo }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wide ring-1 ${styles[tipo]}`}
    >
      {texto}
    </span>
  );
}
