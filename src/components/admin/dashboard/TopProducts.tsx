"use client";

import { motion } from "framer-motion";

interface Top {
  nombre: string;
  cantidad: number;
  pct: number;
}

export function TopProducts({ data }: { data: Top[] }) {
  return (
    <div
      className="p-5"
      style={{
        background: "#111111",
        borderRadius: "12px",
        border: "1px solid rgba(107,33,168,0.2)",
      }}
    >
      <p
        className="mb-4 text-[11px] font-black uppercase tracking-widest"
        style={{ color: "#888888" }}
      >
        Top productos
      </p>

      {data.length === 0 ? (
        <p className="text-sm font-bold" style={{ color: "#555555" }}>
          Aún no hay pedidos.
        </p>
      ) : (
        <div className="space-y-3.5">
          {data.map((p, i) => (
            <div key={p.nombre}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-bold text-white">
                  {i + 1}. {p.nombre}
                </span>
                <span className="font-black" style={{ color: "#F5C018" }}>
                  {p.pct}%
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ background: "#1A1A1A" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.08 }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #6B21A8, #A855F7)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
