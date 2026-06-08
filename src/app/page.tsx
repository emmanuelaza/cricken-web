import { Suspense } from "react";
import { ComboCard } from "@/components/ComboCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ResenaCard } from "@/components/ResenaCard";
import { Section } from "@/components/Section";
import { SedeCard } from "@/components/SedeCard";
import {
  CombosSkeleton,
  MenuSkeleton,
  ResenasSkeleton,
  SedesSkeleton,
} from "@/components/Skeletons";
import { StatsBar } from "@/components/StatsBar";
import { getCombos, getProductos, getResenas, getSedes } from "@/lib/data";

// La landing lee de Supabase (vía cookies del cliente servidor), así que se
// renderiza dinámicamente; evita el intento de prerender estático en el build.
export const dynamic = "force-dynamic";

// ── Secciones async: cada una hace su propia consulta a Supabase, de modo que
//    el shell de la página aparece al instante y cada bloque hace streaming. ──

async function MenuList() {
  const productos = await getProductos();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

async function CombosList() {
  const combos = await getCombos();
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-3">
      {combos.map((combo) => (
        <ComboCard key={combo.id} combo={combo} />
      ))}
    </div>
  );
}

async function SedesList() {
  const sedes = await getSedes();
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {sedes.map((sede) => (
        <SedeCard key={sede.id} sede={sede} />
      ))}
    </div>
  );
}

async function ResenasList() {
  const resenas = await getResenas();
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {resenas.map((resena) => (
        <ResenaCard key={resena.id} resena={resena} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-bg">
        <Hero />
        <StatsBar />

        <Section
          id="menu"
          eyebrow="El menú"
          title="NUESTROS PERROS"
          subtitle="Cada uno apanado a mano con su cubierta crocante. Rellenos a elegir: queso, salchicha o combinado."
        >
          <Suspense fallback={<MenuSkeleton />}>
            <MenuList />
          </Suspense>
        </Section>

        <div style={{ background: "#111111" }}>
          <Section
            id="combos"
            eyebrow="Para compartir"
            title="COMBOS CRICKEN"
            subtitle="Más perros, más papas, mejor precio. Perfectos para el parche y la familia."
          >
            <Suspense fallback={<CombosSkeleton />}>
              <CombosList />
            </Suspense>
          </Section>
        </div>

        <div style={{ background: "#111111" }}>
          <Section
            id="sedes"
            eyebrow="Dónde estamos"
            title="VISÍTANOS EN MEDELLÍN"
            subtitle="Tres puntos para que el antojo nunca quede lejos."
          >
            <Suspense fallback={<SedesSkeleton />}>
              <SedesList />
            </Suspense>
          </Section>
        </div>

        <Section
          id="resenas"
          eyebrow="Lo que dicen"
          title="AMADOS EN MEDELLÍN"
          subtitle="Reseñas reales de Google, Rappi y TikTok."
        >
          <Suspense fallback={<ResenasSkeleton />}>
            <ResenasList />
          </Suspense>
        </Section>
      </main>
      <Footer />
    </>
  );
}
