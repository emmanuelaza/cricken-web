// Formato de precio en pesos colombianos: 22000 -> "$22.000"
const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return cop.format(value);
}

// Precio simple para el CRM: 32000 -> "$32.000"
export function formatPriceCOP(precio: number): string {
  return "$" + (precio ?? 0).toLocaleString("es-CO");
}

// Fecha en español: "10 jun, 14:32"
export function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

