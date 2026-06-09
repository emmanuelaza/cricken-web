"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import type { ConfigNegocio, Horario } from "@/data/types";
import { createClient } from "@/lib/supabase/client";

const DIAS = [
  { dia: 1, label: "Lunes", ap: "10:00", ci: "22:00" },
  { dia: 2, label: "Martes", ap: "10:00", ci: "22:00" },
  { dia: 3, label: "Miércoles", ap: "10:00", ci: "22:00" },
  { dia: 4, label: "Jueves", ap: "10:00", ci: "22:00" },
  { dia: 5, label: "Viernes", ap: "10:00", ci: "22:00" },
  { dia: 6, label: "Sábado", ap: "11:00", ci: "21:00" },
  { dia: 0, label: "Domingo", ap: "11:00", ci: "21:00" },
];

const panel = {
  background: "#111111",
  borderRadius: "12px",
  border: "1px solid rgba(107,33,168,0.2)",
} as const;
const inputStyle = {
  background: "#1A1A1A",
  border: "1px solid rgba(107,33,168,0.3)",
} as const;

export function HorariosClient({
  config: configInicial,
  horarios: horariosIniciales,
}: {
  config: ConfigNegocio;
  horarios: Horario[];
}) {
  const toast = useToast();
  const [config, setConfig] = useState(configInicial);
  const [guardandoCfg, setGuardandoCfg] = useState(false);
  const [guardandoHor, setGuardandoHor] = useState(false);

  // Combina los horarios guardados con los días por defecto.
  const [horas, setHoras] = useState<Horario[]>(() =>
    DIAS.map((d) => {
      const existe = horariosIniciales.find((h) => h.dia === d.dia);
      return (
        existe ?? {
          id: d.dia,
          dia: d.dia,
          apertura: d.ap,
          cierre: d.ci,
          activo: true,
        }
      );
    }),
  );

  const setHora = (dia: number, patch: Partial<Horario>) =>
    setHoras((prev) => prev.map((h) => (h.dia === dia ? { ...h, ...patch } : h)));

  const guardarConfig = async () => {
    setGuardandoCfg(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("config_negocio")
      .upsert({ ...config, id: 1 });
    setGuardandoCfg(false);
    toast(
      error ? "No se pudo guardar: " + error.message : "Configuración guardada ✅",
      error ? "error" : "success",
    );
  };

  const guardarHorarios = async () => {
    setGuardandoHor(true);
    const supabase = createClient();
    const { error } = await supabase.from("horarios").upsert(
      horas.map((h) => ({
        dia: h.dia,
        apertura: h.apertura,
        cierre: h.cierre,
        activo: h.activo,
      })),
      { onConflict: "dia" },
    );
    setGuardandoHor(false);
    toast(
      error ? "No se pudo guardar: " + error.message : "Horarios guardados ✅",
      error ? "error" : "success",
    );
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Config general */}
      <div className="p-5" style={panel}>
        <h2 className="font-display text-xl tracking-wide text-white">
          Configuración del negocio
        </h2>

        <label className="mt-4 flex items-center justify-between text-sm font-bold text-white">
          Pedidos online
          <input
            type="checkbox"
            checked={config.pedidos_activos}
            onChange={(e) =>
              setConfig({ ...config, pedidos_activos: e.target.checked })
            }
          />
        </label>

        <label className="mt-3 block text-sm font-bold text-white">
          Tiempo de entrega (min)
          <input
            type="number"
            value={config.tiempo_entrega}
            onChange={(e) =>
              setConfig({ ...config, tiempo_entrega: parseInt(e.target.value, 10) || 0 })
            }
            className="mt-1 w-full rounded-lg px-3 py-2 font-bold text-white outline-none focus:border-[#A855F7]"
            style={inputStyle}
          />
        </label>

        <label className="mt-3 block text-sm font-bold text-white">
          Pedido mínimo domicilio ($)
          <input
            type="number"
            value={config.pedido_minimo}
            onChange={(e) =>
              setConfig({ ...config, pedido_minimo: parseInt(e.target.value, 10) || 0 })
            }
            className="mt-1 w-full rounded-lg px-3 py-2 font-bold text-white outline-none focus:border-[#A855F7]"
            style={inputStyle}
          />
        </label>

        <label className="mt-3 block text-sm font-bold text-white">
          Mensaje cuando cerrado
          <textarea
            value={config.mensaje_cerrado ?? ""}
            onChange={(e) => setConfig({ ...config, mensaje_cerrado: e.target.value })}
            rows={2}
            className="mt-1 w-full resize-none rounded-lg px-3 py-2 font-bold text-white outline-none focus:border-[#A855F7]"
            style={inputStyle}
          />
        </label>

        <button
          type="button"
          onClick={guardarConfig}
          disabled={guardandoCfg}
          className="mt-4 rounded-lg px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60"
          style={{ background: "#6B21A8" }}
        >
          {guardandoCfg ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>

      {/* Horarios por día */}
      <div className="p-5" style={panel}>
        <h2 className="font-display text-xl tracking-wide text-white">Horarios</h2>
        <div className="mt-4 space-y-2">
          {DIAS.map((d) => {
            const h = horas.find((x) => x.dia === d.dia)!;
            return (
              <div key={d.dia} className="flex items-center gap-2 text-sm">
                <span className="w-24 font-bold text-white">{d.label}</span>
                <input
                  type="time"
                  value={h.apertura}
                  onChange={(e) => setHora(d.dia, { apertura: e.target.value })}
                  className="rounded-lg px-2 py-1 font-bold text-white outline-none"
                  style={inputStyle}
                />
                <input
                  type="time"
                  value={h.cierre}
                  onChange={(e) => setHora(d.dia, { cierre: e.target.value })}
                  className="rounded-lg px-2 py-1 font-bold text-white outline-none"
                  style={inputStyle}
                />
                <input
                  type="checkbox"
                  checked={h.activo}
                  onChange={(e) => setHora(d.dia, { activo: e.target.checked })}
                  className="ml-auto"
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={guardarHorarios}
          disabled={guardandoHor}
          className="mt-4 rounded-lg px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60"
          style={{ background: "#6B21A8" }}
        >
          {guardandoHor ? "Guardando…" : "Guardar horarios"}
        </button>
      </div>
    </div>
  );
}
