"use client";

import { useRouter } from "next/navigation";

export function ErrorState({ message }: { message?: string }) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      style={{ background: "#0A0A0A" }}
    >
      <span style={{ fontSize: "3rem", color: "#F07820" }} aria-hidden>
        ⚠️
      </span>
      <h2 className="mt-3 font-display text-3xl tracking-wide text-white">
        Error al cargar
      </h2>
      <p className="mt-2 max-w-md text-sm font-bold" style={{ color: "#888888" }}>
        {message ?? "No pudimos cargar los datos. Intenta de nuevo."}
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-5 rounded-lg px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
        style={{ background: "#6B21A8" }}
      >
        Reintentar
      </button>
    </div>
  );
}
