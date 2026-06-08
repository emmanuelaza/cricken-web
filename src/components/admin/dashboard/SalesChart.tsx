"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { formatPriceCOP } from "@/lib/format";

interface Punto {
  dia: string;
  total: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 text-xs font-bold"
      style={{
        background: "#1A1A1A",
        border: "1px solid rgba(107,33,168,0.5)",
        borderRadius: "8px",
      }}
    >
      <p style={{ color: "#888888" }}>{label}</p>
      <p style={{ color: "#F5C018" }}>{formatPriceCOP(payload[0].value)}</p>
    </div>
  );
}

export function SalesChart({ data }: { data: Punto[] }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div
      className="p-5"
      style={{
        background: "#111111",
        borderRadius: "12px",
        border: "1px solid rgba(107,33,168,0.2)",
      }}
    >
      <p className="mb-4 text-[11px] font-black uppercase tracking-widest" style={{ color: "#888888" }}>
        Ventas por semana
      </p>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(107,33,168,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="dia"
              tick={{ fill: "#888888", fontSize: 12 }}
              axisLine={{ stroke: "#333333" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#888888", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : `${v}`)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(107,33,168,0.1)" }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={hover === i ? "#A855F7" : "#6B21A8"}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
