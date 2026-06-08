"use client";

import { QRCodeSVG } from "qrcode.react";

// TODO: cambiar por el dominio real cuando esté listo.
const CATALOGO_URL = "https://cricken.vercel.app/catalogo";

const previewItems = [
  { emoji: "🧀", nombre: "Dori Dog", precio: "$10.000" },
  { emoji: "🥔", nombre: "Papa Dog", precio: "$12.000" },
  { emoji: "🌶️", nombre: "Takis Dog", precio: "$9.250" },
  { emoji: "🍫", nombre: "Choco Dog", precio: "$11.000" },
];

export function QrSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Mockup de teléfono */}
        <div className="flex justify-center">
          <div
            className="bg-brand-gradient"
            style={{ borderRadius: "40px", padding: "3px" }}
          >
            <div
              className="w-[270px] overflow-hidden"
              style={{ borderRadius: "37px", background: "#111111" }}
            >
              <div className="px-5 pb-6 pt-7 text-center">
                <p className="font-display text-3xl leading-none text-gradient">
                  CRICKEN
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted">
                  Catálogo
                </p>
              </div>
              <ul className="space-y-2 px-4 pb-7">
                {previewItems.map((it) => (
                  <li
                    key={it.nombre}
                    className="flex items-center gap-3 rounded-xl p-2"
                    style={{ background: "#0A0A0A" }}
                  >
                    <span
                      className="grid h-9 w-9 place-items-center rounded-lg text-xl"
                      style={{ background: "#1A1A1A" }}
                      aria-hidden
                    >
                      {it.emoji}
                    </span>
                    <span className="flex-1 text-[13px] font-black text-white">
                      {it.nombre}
                    </span>
                    <span className="font-display text-lg leading-none text-yellow">
                      {it.precio}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* QR */}
        <div className="text-center md:text-left">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-brand-light">
            Pide sin filas
          </p>
          <h2 className="mt-2 font-display text-5xl tracking-wide text-white md:text-6xl">
            Escanea y ordena
          </h2>
          <p className="mt-3 max-w-md font-bold text-muted md:mx-0">
            Apunta tu cámara al QR y abre el catálogo completo en tu teléfono.
            Elige tus perros y pide al instante.
          </p>

          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row md:justify-start">
            <div className="flex flex-col items-center">
              <div
                className="glow-brand inline-block p-4"
                style={{
                  background: "#0A0A0A",
                  borderRadius: "16px",
                  border: "1px solid rgba(107,33,168,0.3)",
                }}
              >
                <QRCodeSVG
                  value={CATALOGO_URL}
                  size={180}
                  fgColor="#6B21A8"
                  bgColor="#0A0A0A"
                  level="M"
                />
              </div>
              <p className="mt-3 max-w-[180px] text-center text-sm font-bold text-muted">
                Escanea para ver el menú completo
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-display text-3xl tracking-wide text-yellow">
                /catalogo
              </p>
              <p className="mt-1 text-sm font-bold text-muted">
                Disponible 24/7 desde cualquier sede
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
