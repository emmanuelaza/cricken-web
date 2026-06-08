import type { Resena } from "@/data/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-yellow" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export function ResenaCard({ resena }: { resena: Resena }) {
  return (
    <figure className="card-cricken flex h-full flex-col p-6">
      <Stars rating={resena.rating} />
      <blockquote className="mt-3 flex-1 text-sm font-bold leading-relaxed text-white/90">
        “{resena.texto}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/25 text-sm font-black text-brand-light">
          {resena.initials}
        </span>
        <span>
          <span className="block text-sm font-black text-white">
            {resena.autor}
          </span>
          {resena.plataforma && (
            <span className="block text-xs font-bold text-muted">
              {resena.plataforma}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
