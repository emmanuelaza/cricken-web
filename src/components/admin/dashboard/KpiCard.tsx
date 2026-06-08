"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const acentos: Record<string, string> = {
  purple: "#A855F7",
  yellow: "#F5C018",
  green: "#22C55E",
  red: "#EF4444",
};

interface KpiCardProps {
  titulo: string;
  valor: number;
  format?: (n: number) => string;
  delta?: string;
  deltaPositivo?: boolean;
  icono: LucideIcon;
  color?: "purple" | "yellow" | "green" | "red";
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function KpiCard({
  titulo,
  valor,
  format,
  delta,
  deltaPositivo = true,
  icono: Icon,
  color = "purple",
}: KpiCardProps) {
  const animado = useCountUp(valor);
  const acento = acentos[color];

  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden p-5 transition-transform hover:-translate-y-0.5"
      style={{
        background: "#111111",
        borderRadius: "12px",
        border: "1px solid rgba(107,33,168,0.2)",
      }}
    >
      <Icon
        size={20}
        className="absolute right-4 top-4"
        style={{ color: acento }}
      />
      <p
        className="text-[11px] font-black uppercase tracking-widest"
        style={{ color: "#888888" }}
      >
        {titulo}
      </p>
      <p
        className="mt-2 font-display leading-none text-white"
        style={{ fontSize: "2.8rem" }}
      >
        {format ? format(animado) : animado}
      </p>
      {delta && (
        <p
          className="mt-1 text-xs font-bold"
          style={{ color: deltaPositivo ? "#22C55E" : "#EF4444" }}
        >
          {deltaPositivo ? "↑" : "↓"} {delta}
        </p>
      )}
    </motion.div>
  );
}
