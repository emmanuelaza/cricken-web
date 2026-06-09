// Capa de datos del CRM — lee Supabase con la sesión autenticada del admin
// (cookies del cliente servidor). Requiere las políticas RLS "admin lee ..."
// del Paso 7. Lanza el error en fallos reales para que la página muestre
// <ErrorState>; "no encontrado" devuelve null (sin error).

import "server-only";
import type {
  AdminUser,
  Cliente,
  Combo,
  HistorialEntry,
  NotaCliente,
  Pedido,
  Producto,
} from "@/data/types";
import { createClient } from "@/lib/supabase/server";

// Usuarios admin (degrada a [] si la tabla aún no existe).
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as AdminUser[]) ?? [];
  } catch {
    return [];
  }
}

// Historial de auditoría (degrada a [] si la tabla aún no existe).
export async function getHistorial(): Promise<HistorialEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("historial")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return [];
    return (data as HistorialEntry[]) ?? [];
  } catch {
    return [];
  }
}

// Notas de un cliente (degrada a [] si la tabla aún no existe).
export async function getNotasCliente(clienteId: string): Promise<NotaCliente[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notas_clientes")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as NotaCliente[]) ?? [];
  } catch {
    return [];
  }
}

// Primera nota de un cliente buscado por teléfono (para el banner del pedido).
export async function getPrimeraNotaPorTelefono(
  telefono: string | null,
): Promise<string | null> {
  if (!telefono) return null;
  try {
    const supabase = await createClient();
    const { data: cliente } = await supabase
      .from("clientes")
      .select("id")
      .eq("telefono", telefono)
      .maybeSingle();
    if (!cliente) return null;
    const { data: notas } = await supabase
      .from("notas_clientes")
      .select("texto")
      .eq("cliente_id", cliente.id)
      .order("created_at", { ascending: false })
      .limit(1);
    return notas?.[0]?.texto ?? null;
  } catch {
    return null;
  }
}

export async function getCombosAdmin(): Promise<Combo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("combos")
    .select("*, combo_items(texto, orden)")
    .order("orden");
  if (error) throw new Error(error.message);
  return (data as Combo[]) ?? [];
}

export async function getPedidosAdmin(): Promise<Pedido[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Pedido[]) ?? [];
}

export async function getPedidoAdmin(id: string): Promise<Pedido | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Pedido) ?? null;
}

export async function getClientesAdmin(): Promise<Cliente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("total_gastado", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Cliente[]) ?? [];
}

export type ClienteConPedidos = Cliente & { pedidos: Pedido[] };

export async function getClienteAdmin(
  id: string,
): Promise<ClienteConPedidos | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*, pedidos(id, total, productos, estado, canal, created_at)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ClienteConPedidos) ?? null;
}

export async function getProductosAdmin(): Promise<Producto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("orden");
  if (error) throw new Error(error.message);
  return (data as Producto[]) ?? [];
}

export interface DashboardData {
  kpis: {
    pedidosHoy: number;
    pedidosHoyDelta: number;
    ingresosMes: number;
    clientesTotal: number;
    clientesMes: number;
    vip: number;
  };
  ventasSemana: { dia: string; total: number }[];
  topProductos: { nombre: string; cantidad: number; pct: number }[];
  recientes: Pedido[];
}

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const [pedidosRes, clientesRes] = await Promise.all([
    supabase.from("pedidos").select("*"),
    supabase.from("clientes").select("id, segmento, created_at"),
  ]);

  if (pedidosRes.error) throw new Error(pedidosRes.error.message);
  if (clientesRes.error) throw new Error(clientesRes.error.message);

  const pedidos = (pedidosRes.data as Pedido[]) ?? [];
  const clientes = (clientesRes.data as Cliente[]) ?? [];

  const hoy = new Date();
  const esHoy = (f: string) =>
    new Date(f).toDateString() === hoy.toDateString();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const pedidosHoy = pedidos.filter((p) => esHoy(p.created_at)).length;
  const ingresosMes = pedidos
    .filter(
      (p) => new Date(p.created_at) >= inicioMes && p.estado === "entregado",
    )
    .reduce((acc, p) => acc + (p.total ?? 0), 0);
  const clientesMes = clientes.filter(
    (c) => c.created_at && new Date(c.created_at) >= inicioMes,
  ).length;
  const vip = clientes.filter((c) => c.segmento === "vip").length;

  const semana: { dia: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const total = pedidos
      .filter(
        (p) =>
          p.estado === "entregado" &&
          new Date(p.created_at).toDateString() === d.toDateString(),
      )
      .reduce((acc, p) => acc + (p.total ?? 0), 0);
    semana.push({ dia: DIAS[d.getDay()], total });
  }

  const conteo = new Map<string, number>();
  for (const p of pedidos) {
    for (const item of p.productos ?? []) {
      conteo.set(item.nombre, (conteo.get(item.nombre) ?? 0) + item.cantidad);
    }
  }
  const totalUnidades = [...conteo.values()].reduce((a, b) => a + b, 0) || 1;
  const topProductos = [...conteo.entries()]
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      pct: Math.round((cantidad / totalUnidades) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const recientes = [...pedidos]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return {
    kpis: {
      pedidosHoy,
      pedidosHoyDelta: pedidosHoy,
      ingresosMes,
      clientesTotal: clientes.length,
      clientesMes,
      vip,
    },
    ventasSemana: semana,
    topProductos,
    recientes,
  };
}
