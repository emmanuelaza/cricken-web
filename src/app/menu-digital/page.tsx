import type { Metadata } from "next";
import { MenuDigital } from "@/components/MenuDigital";
import { getCombos, getProductos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menú Digital · Cricken",
  description: "Menú digital de Cricken para clientes en el local.",
};

// Lee de Supabase (cookies del cliente servidor) → render dinámico.
export const dynamic = "force-dynamic";

export default async function MenuDigitalPage() {
  const [productos, combos] = await Promise.all([getProductos(), getCombos()]);

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-md"
      style={{ background: "#0A0A0A" }}
    >
      {/* Header */}
      <header
        className="px-5 py-6 text-center"
        style={{
          background: "#0A0A0A",
          borderBottom: "1px solid rgba(107,33,168,0.4)",
        }}
      >
        <h1 className="font-display text-5xl leading-none tracking-wide text-gradient">
          CRICKEN
        </h1>
        <p
          className="mt-1 text-sm font-extrabold uppercase tracking-widest"
          style={{ color: "#888888" }}
        >
          Menú Digital 🇰🇷
        </p>
      </header>

      <main>
        <MenuDigital productos={productos} combos={combos} />
      </main>

      {/* Footer */}
      <footer
        className="px-5 py-7 text-center"
        style={{
          background: "#0A0A0A",
          borderTop: "1px solid rgba(107,33,168,0.4)",
        }}
      >
        <p className="text-sm font-bold text-white/90">
          📍 Pregúntale a nuestro equipo para hacer tu pedido
        </p>
        <p
          className="mt-2 font-display text-xl tracking-wide"
          style={{ color: "#F5C018" }}
        >
          @_cricken_
        </p>
      </footer>
    </div>
  );
}
