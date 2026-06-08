export function EmptyState({
  icon = "📦",
  titulo,
  descripcion,
}: {
  icon?: string;
  titulo: string;
  descripcion?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span style={{ fontSize: "2.5rem" }} aria-hidden>
        {icon}
      </span>
      <p className="mt-3 font-display text-2xl tracking-wide text-white">
        {titulo}
      </p>
      {descripcion && (
        <p className="mt-1 max-w-sm text-sm font-bold" style={{ color: "#888888" }}>
          {descripcion}
        </p>
      )}
    </div>
  );
}
