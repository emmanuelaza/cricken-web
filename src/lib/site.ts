// Configuración central de la marca: contacto, redes y canales de pedido.
// Reemplaza los valores placeholder por los reales cuando los tengas.

export const site = {
  name: "Cricken",
  tagline: "Perros coreanos de Medellín",
  // Número en formato internacional sin signos para los enlaces de WhatsApp.
  whatsapp: "573041428593",
  whatsappMensaje: "¡Hola Cricken! Quiero hacer un pedido 🌭",
  instagram: "https://instagram.com/cricken",
  tiktok: "https://tiktok.com/@cricken",
  rappi: "https://www.rappi.com.co",
  didi: "https://www.didi-food.com",
} as const;

export function whatsappLink(mensaje: string = site.whatsappMensaje): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

// Nombres de sede de respaldo para el dropdown del formulario, por si la tabla
// `sedes` de Supabase aún no tiene datos.
export const sedesFallback = [
  "Sede Centro — Candelaria",
  "Sede Manrique",
  "Food Truck",
] as const;

export const navLinks = [
  { href: "#menu", label: "Menú" },
  { href: "#combos", label: "Combos" },
  { href: "#sedes", label: "Sedes" },
  { href: "#resenas", label: "Reseñas" },
] as const;
