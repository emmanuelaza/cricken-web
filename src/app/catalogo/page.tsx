import type { Metadata } from "next";
import { headers } from "next/headers";
import { Badge } from "@/components/Badge";
import type { CategoriaProducto, Producto } from "@/data/types";
import { getCombos, getProductos, registrarEscaneoQr } from "@/lib/data";
import { formatCOP } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catálogo · Cricken",
  description: "Menú completo de perros coreanos Cricken.",
};

const ordenCategorias: { key: CategoriaProducto; label: string; emoji: string }[] = [
  { key: "salado", label: "Salados", emoji: "🧀" },
  { key: "dulce", label: "Dulces", emoji: "🍫" },
  { key: "picante", label: "Picantes", emoji: "🌶️" },
  { key: "especial", label: "Especiales", emoji: "✨" },
];

function MenuRow({ producto }: { producto: Producto }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-2xl"
        style={{ background: "#1A1A1A" }}
        aria-hidden
      >
        {producto.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-white">{producto.nombre}</h3>
          {producto.badge_texto && producto.badge_tipo && (
            <Badge texto={producto.badge_texto} tipo={producto.badge_tipo} />
          )}
        </div>
        {producto.descripcion && (
          <p className="mt-0.5 text-sm font-bold leading-snug text-muted">
            {producto.descripcion}
          </p>
        )}
      </div>
      <span className="shrink-0 font-display text-xl leading-none text-yellow">
        {formatCOP(producto.precio)}
      </span>
    </li>
  );
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ sede?: string }>;
}) {
  const { sede } = await searchParams;

  // Registra la visita al catálogo en pedidos_qr (analytics del CRM).
  const userAgent = (await headers()).get("user-agent") ?? "";
  await registrarEscaneoQr(sede ?? "qr", userAgent);

  const [productos, combos] = await Promise.all([getProductos(), getCombos()]);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-bg pb-28">
      {/* Encabezado */}
      <header
        className="relative overflow-hidden px-5 pb-7 pt-10 text-center"
        style={{
          background: `
            radial-gradient(70% 90% at 50% 0%, rgba(107,33,168,0.4) 0%, transparent 70%),
            #0A0A0A
          `,
        }}
      >
        <h1 className="font-display text-5xl tracking-wide text-gradient">
          {site.name}
        </h1>
        <p className="mt-1 text-sm font-extrabold uppercase tracking-widest text-muted">
          {site.tagline}
        </p>
      </header>

      <main className="px-5">
        {ordenCategorias.map((cat) => {
          const items = productos.filter((p) => p.categoria === cat.key);
          if (items.length === 0) return null;
          return (
            <section key={cat.key} className="mt-7">
              <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-white">
                <span aria-hidden>{cat.emoji}</span> {cat.label}
              </h2>
              <ul className="mt-1 divide-y divide-white/5">
                {items.map((p) => (
                  <MenuRow key={p.id} producto={p} />
                ))}
              </ul>
            </section>
          );
        })}

        {/* Combos */}
        <section className="mt-9">
          <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-white">
            <span aria-hidden>🍟</span> Combos
          </h2>
          <div className="mt-2 space-y-3">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="p-4"
                style={{
                  background: "#111111",
                  borderRadius: "14px",
                  border: combo.featured
                    ? "2px solid #F5C018"
                    : "1px solid rgba(107,33,168,0.3)",
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl tracking-wide text-white">
                      {combo.nombre}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      {combo.tier}
                    </p>
                  </div>
                  <span className="font-display text-2xl leading-none text-yellow">
                    {formatCOP(combo.precio)}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm font-bold text-white/80">
                  {combo.combo_items.map((item) => (
                    <li key={item.orden}>· {item.texto}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CTA fija */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md bg-bg/90 p-4 backdrop-blur-md"
        style={{ borderTop: "1px solid rgba(107,33,168,0.3)" }}
      >
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-lg bg-yellow py-3.5 text-base font-black uppercase tracking-wide text-bg"
        >
          Pedir por WhatsApp 🌭
        </a>
      </div>
    </div>
  );
}
