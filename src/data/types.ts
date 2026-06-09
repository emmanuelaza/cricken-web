// Tipos de dominio — espejo de las tablas de Supabase.
// Mantener sincronizado con el SQL del setup (productos, combos, sedes, resenas).

export type CategoriaProducto = "salado" | "dulce" | "picante" | "especial";
export type BadgeTipo = "yellow" | "purple";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  /** Precio en pesos colombianos, sin decimales. */
  precio: number;
  emoji: string | null;
  categoria: CategoriaProducto;
  badge_texto: string | null;
  badge_tipo: BadgeTipo | null;
  foto_url?: string | null;
  activo: boolean;
  orden: number;
}

export interface ComboItem {
  texto: string;
  orden: number;
}

export interface Combo {
  id: string;
  tier: string;
  nombre: string;
  precio: number;
  precio_label: string | null;
  featured: boolean;
  activo: boolean;
  orden: number;
  combo_items: ComboItem[];
}

export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  descripcion: string | null;
  emoji: string;
  tag: string | null;
  activo: boolean;
  orden: number;
}

export interface Resena {
  id: string;
  autor: string;
  initials: string;
  plataforma: string | null;
  texto: string;
  rating: number;
  activo: boolean;
  orden: number;
}

// Producto tal como se guarda en pedidos.productos (jsonb).
export interface PedidoProducto {
  nombre: string;
  precio: number;
  cantidad: number;
}

export type EstadoPedido = "nuevo" | "confirmado" | "entregado" | "cancelado";
export type TipoPedido = "recoger" | "domicilio";

export interface Pedido {
  id: string;
  cliente_nombre: string;
  cliente_telefono: string;
  tipo_pedido: TipoPedido | string;
  sede: string | null;
  direccion: string | null;
  barrio: string | null;
  productos: PedidoProducto[];
  total: number;
  estado: EstadoPedido | string;
  canal: string;
  notas: string | null;
  created_at: string;
}

export type Segmento = "nuevo" | "regular" | "vip" | "en_riesgo";

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  sede_favorita: string | null;
  segmento: Segmento | string;
  total_pedidos: number;
  total_gastado: number;
  rating_promedio: number | null;
  notas: string | null;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

// ── Configuración del negocio / horarios ────────────────────────────────
export interface ConfigNegocio {
  id: number;
  pedidos_activos: boolean;
  tiempo_entrega: number;
  pedido_minimo: number;
  mensaje_cerrado: string | null;
}

export interface Horario {
  id: number;
  dia: number; // 0=Domingo … 6=Sábado
  apertura: string; // "10:00"
  cierre: string; // "22:00"
  activo: boolean;
}

// ── Usuarios admin ──────────────────────────────────────────────────────
export type RolAdmin = "dueno" | "encargado" | "cajero";

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  rol: RolAdmin | string;
  sede: string | null;
  activo: boolean;
  created_at?: string;
}

// ── Notas internas de clientes ──────────────────────────────────────────
export interface NotaCliente {
  id: string;
  cliente_id: string;
  texto: string;
  autor: string | null;
  created_at: string;
}

// ── Historial / auditoría ───────────────────────────────────────────────
export interface HistorialEntry {
  id: string;
  accion: "crear" | "actualizar" | "eliminar" | string;
  tabla: string;
  registro_id: string | null;
  usuario: string | null;
  created_at: string;
}
