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

export interface Pedido {
  id: string;
  cliente_nombre: string;
  cliente_telefono: string;
  sede: string;
  productos: PedidoProducto[];
  total: number;
  estado: string;
  canal: string;
  notas: string | null;
  created_at: string;
}
