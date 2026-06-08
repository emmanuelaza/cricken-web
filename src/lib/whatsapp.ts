import type { CartItem } from "@/context/CartContext";
import { formatCOP } from "@/lib/format";
import { site } from "@/lib/site";

interface PedidoMsgOptions {
  sede?: string;
  nombre?: string;
}

// Construye el mensaje de pedido para WhatsApp con el formato oficial CRICKEN.
export function buildPedidoMessage(
  items: Pick<CartItem, "nombre" | "precio" | "cantidad">[],
  total: number,
  opts: PedidoMsgOptions = {},
): string {
  const lineas = items
    .map(
      (i) =>
        `- ${i.cantidad}x ${i.nombre} - ${formatCOP(i.precio * i.cantidad)}`,
    )
    .join("\n");

  let msg = `🌭 NUEVO PEDIDO CRICKEN\n\nProductos:\n${lineas}\n\nTOTAL: ${formatCOP(total)}`;

  if (opts.sede) msg += `\n\nQuiero recoger en: ${opts.sede}`;
  if (opts.nombre) msg += `\nMi nombre: ${opts.nombre}`;

  return msg;
}

// Enlace wa.me listo para abrir con el mensaje del pedido.
export function pedidoWhatsappLink(
  items: Pick<CartItem, "nombre" | "precio" | "cantidad">[],
  total: number,
  opts: PedidoMsgOptions = {},
): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    buildPedidoMessage(items, total, opts),
  )}`;
}
