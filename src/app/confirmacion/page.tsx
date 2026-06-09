import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmacionEfectos } from "@/components/ConfirmacionEfectos";
import type { Pedido } from "@/data/types";
import { formatCOP } from "@/lib/format";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { pedidoWhatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pedido confirmado · Cricken",
};

async function fetchPedido(id: string): Promise<Pedido | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .eq("id", id)
      .single();
    return (data as Pedido) ?? null;
  } catch {
    return null;
  }
}

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const pedido = id ? await fetchPedido(id) : null;

  const numero = id ? `CR-${id.slice(0, 6).toUpperCase()}` : "CR-------";

  const waHref = pedido
    ? pedidoWhatsappLink(pedido.productos, pedido.total, {
        sede:
          pedido.tipo_pedido === "domicilio"
            ? `Domicilio · ${pedido.direccion ?? ""}, ${pedido.barrio ?? ""}`
            : (pedido.sede ?? undefined),
        nombre: pedido.cliente_nombre,
      })
    : `https://wa.me/${site.whatsapp}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <ConfirmacionEfectos />
          <h1 className="mt-5 font-display text-5xl tracking-wide text-white">
            ¡Pedido confirmado!
          </h1>
          <p className="mt-2 font-display text-2xl tracking-wide text-yellow">
            #{numero}
          </p>
        </div>

        <div
          className="mt-8 p-6"
          style={{
            background: "#111111",
            borderRadius: "14px",
            border: "1px solid rgba(107,33,168,0.3)",
          }}
        >
          {pedido ? (
            <>
              <ul className="space-y-2">
                {pedido.productos.map((p, i) => (
                  <li
                    key={`${p.nombre}-${i}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-bold text-white/90">
                      {p.cantidad}x {p.nombre}
                    </span>
                    <span className="shrink-0 font-bold text-muted">
                      {formatCOP(p.precio * p.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="mt-4 flex items-baseline justify-between pt-4"
                style={{ borderTop: "1px solid rgba(107,33,168,0.3)" }}
              >
                <span className="text-sm font-black uppercase tracking-widest text-muted">
                  Total
                </span>
                <span className="font-display text-3xl leading-none text-yellow">
                  {formatCOP(pedido.total)}
                </span>
              </div>

              <div
                className="mt-5 space-y-1.5 pt-4 text-sm font-bold text-white/90"
                style={{ borderTop: "1px solid rgba(107,33,168,0.2)" }}
              >
                {pedido.tipo_pedido === "domicilio" ? (
                  <p>
                    🛵 Domicilio a: {pedido.direccion}, {pedido.barrio}, Medellín
                  </p>
                ) : (
                  <p>📍 Recoger en: {pedido.sede}</p>
                )}
                <p>📱 Tel: {pedido.cliente_telefono}</p>
                {pedido.notas && <p>📝 {pedido.notas}</p>}
              </div>
            </>
          ) : (
            <p className="text-center font-bold text-muted">
              Recibimos tu pedido. En unos minutos te contactamos por WhatsApp
              para confirmarlo. 🌭
            </p>
          )}

          <p className="mt-5 text-center text-sm font-bold italic text-muted">
            “En unos minutos confirmamos tu pedido por WhatsApp 🌭”
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-lg bg-yellow py-3.5 text-base font-black uppercase tracking-wide text-bg transition-transform hover:scale-[1.02]"
          >
            Seguir en WhatsApp
          </a>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-lg py-3.5 text-base font-black uppercase tracking-wide text-white transition-colors hover:bg-brand"
            style={{ border: "1px solid rgba(107,33,168,0.5)" }}
          >
            Volver al menú
          </Link>
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted">
          {site.name} · Medellín 🇨🇴
        </p>
      </div>
    </main>
  );
}
