// ─────────────────────────────────────────────────────────────────────────
// CAPA DE ACCESO A DATOS — Supabase (live) con fallback estático.
//
// Lee productos, combos (+ combo_items), sedes y resenas desde Supabase.
// Si una consulta falla O devuelve vacío, cae a los datos de data/menu.ts
// para que la web nunca quede sin contenido. En cuanto las tablas tengan
// filas, se usan automáticamente las de Supabase.
// ─────────────────────────────────────────────────────────────────────────

import {
  combos as combosSeed,
  productos as productosSeed,
  resenas as resenasSeed,
  sedes as sedesSeed,
} from "@/data/menu";
import type {
  Combo,
  ConfigNegocio,
  Horario,
  Producto,
  Resena,
  Sede,
} from "@/data/types";
import { createClient } from "@/lib/supabase/server";

export const CONFIG_DEFAULT: ConfigNegocio = {
  id: 1,
  pedidos_activos: true,
  tiempo_entrega: 35,
  pedido_minimo: 0,
  mensaje_cerrado: "Estamos cerrados por ahora. ¡Vuelve pronto! 🌭",
};

// Config del negocio (degrada a defaults si la tabla no existe).
export async function getConfigNegocio(): Promise<ConfigNegocio> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("config_negocio")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return CONFIG_DEFAULT;
    return data as ConfigNegocio;
  } catch {
    return CONFIG_DEFAULT;
  }
}

export async function getHorarios(): Promise<Horario[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("horarios")
      .select("*")
      .order("dia");
    if (error) return [];
    return (data as Horario[]) ?? [];
  } catch {
    return [];
  }
}

function ordenar<T extends { orden: number }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.orden - b.orden);
}

export async function getProductos(): Promise<Producto[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("orden");

    if (error) throw new Error(error.message);
    if (data && data.length > 0) return data;

    console.warn(
      "[getProductos] Supabase devolvió 0 filas — usando fallback estático (data/menu.ts).",
    );
  } catch (e) {
    console.error(
      "[getProductos] error de Supabase, usando fallback:",
      e instanceof Error ? e.message : e,
    );
  }
  return ordenar(productosSeed.filter((p) => p.activo));
}

export async function getCombos(): Promise<Combo[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("combos")
      .select("*, combo_items(texto, orden)")
      .eq("activo", true)
      .order("orden");

    if (error) throw new Error(error.message);
    if (data && data.length > 0) {
      return data.map((combo) => ({
        ...combo,
        combo_items: ordenar(combo.combo_items ?? []),
      }));
    }

    console.warn(
      "[getCombos] Supabase devolvió 0 filas — usando fallback estático (data/menu.ts).",
    );
  } catch (e) {
    console.error(
      "[getCombos] error de Supabase, usando fallback:",
      e instanceof Error ? e.message : e,
    );
  }
  return ordenar(combosSeed.filter((c) => c.activo)).map((c) => ({
    ...c,
    combo_items: ordenar(c.combo_items),
  }));
}

export async function getSedes(): Promise<Sede[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sedes")
      .select("*")
      .eq("activo", true)
      .order("orden");

    if (error) throw new Error(error.message);
    if (data && data.length > 0) return data;

    console.warn(
      "[getSedes] Supabase devolvió 0 filas — usando fallback estático (data/menu.ts).",
    );
  } catch (e) {
    console.error(
      "[getSedes] error de Supabase, usando fallback:",
      e instanceof Error ? e.message : e,
    );
  }
  return ordenar(sedesSeed.filter((s) => s.activo));
}

export async function getResenas(): Promise<Resena[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resenas")
      .select("*")
      .eq("activo", true)
      .order("orden");

    if (error) throw new Error(error.message);
    if (data && data.length > 0) return data;

    console.warn(
      "[getResenas] Supabase devolvió 0 filas — usando fallback estático (data/menu.ts).",
    );
  } catch (e) {
    console.error(
      "[getResenas] error de Supabase, usando fallback:",
      e instanceof Error ? e.message : e,
    );
  }
  return ordenar(resenasSeed.filter((r) => r.activo));
}

// Registra una visita al catálogo QR en pedidos_qr (analytics del CRM).
export async function registrarEscaneoQr(
  sedeOrigen: string,
  userAgent: string,
): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("pedidos_qr").insert({
      source: "qr",
      sede_origen: sedeOrigen,
      user_agent: userAgent,
    });
    if (error) console.error("[registrarEscaneoQr]", error.message);
  } catch (e) {
    console.error("[registrarEscaneoQr]", e instanceof Error ? e.message : e);
  }
}
