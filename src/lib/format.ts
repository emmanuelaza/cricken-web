// Formato de precio en pesos colombianos: 22000 -> "$22.000"
const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return cop.format(value);
}
