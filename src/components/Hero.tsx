import { whatsappLink } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-bg"
    >
      {/* Glows radiales superpuestos: morado, naranja, amarillo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 50% at 20% 25%, rgba(107,33,168,0.45) 0%, transparent 60%),
            radial-gradient(50% 45% at 85% 30%, rgba(240,120,32,0.30) 0%, transparent 60%),
            radial-gradient(55% 50% at 60% 90%, rgba(245,192,24,0.22) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span
            className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide text-brand-light"
            style={{
              background: "rgba(107,33,168,0.18)",
              border: "1px solid rgba(107,33,168,0.45)",
            }}
          >
            🇰🇷 Auténtico estilo coreano · Medellín
          </span>

          <h1 className="mt-6 font-display leading-[0.9] tracking-wide text-white [font-size:clamp(4rem,12vw,8rem)]">
            <span className="block text-yellow">PERROS</span>
            <span className="block">
              <span className="text-brand-light">CORE</span>
              <span className="text-white">ANOS</span>
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg font-bold text-muted md:mx-0">
            Dori, Papa, Takis, Choco y más. Dulces, salados y picantes, recién
            apanados. Combos para el parche y domicilios a toda la ciudad.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-yellow px-7 py-4 text-base font-black uppercase tracking-wide text-bg transition-transform hover:scale-105 sm:w-auto"
            >
              Pedir por WhatsApp
            </a>
            <a
              href="#menu"
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/70 px-7 py-4 text-base font-black uppercase tracking-wide text-white transition-colors hover:border-brand hover:bg-brand hover:text-white sm:w-auto"
            >
              Ver el menú
            </a>
          </div>
        </div>

        {/* Mosaico de emojis con glow */}
        <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
          {["🌭", "🧀", "🌶️", "🍫"].map((e, i) => (
            <div
              key={e}
              className={`grid aspect-square place-items-center rounded-2xl text-6xl ${
                i % 2 === 0 ? "rotate-3" : "-rotate-3"
              }`}
              style={{
                background: "#111111",
                border: "1px solid rgba(107,33,168,0.3)",
                boxShadow: "0 0 40px rgba(107,33,168,0.25)",
              }}
            >
              <span aria-hidden>{e}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
