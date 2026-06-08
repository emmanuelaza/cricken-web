import type { Sede } from "@/data/types";

export function SedeCard({ sede }: { sede: Sede }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Cricken ${sede.nombre} ${sede.direccion} Medellín`,
  )}`;

  return (
    <article className="card-cricken flex flex-col p-6">
      <div className="flex items-center gap-3">
        <span
          className="grid h-12 w-12 place-items-center rounded-lg text-2xl"
          style={{ background: "#1A1A1A" }}
          aria-hidden
        >
          {sede.emoji}
        </span>
        {sede.tag && (
          <span className="rounded-md bg-brand/25 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-light">
            {sede.tag}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl tracking-wide text-white">
        {sede.nombre}
      </h3>
      <p className="mt-1 text-sm font-extrabold text-white">{sede.direccion}</p>
      {sede.descripcion && (
        <p className="mt-1 flex-1 text-sm font-bold text-muted">
          {sede.descripcion}
        </p>
      )}

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-black uppercase tracking-wide text-brand-light hover:text-yellow"
      >
        Ver en el mapa →
      </a>
    </article>
  );
}
