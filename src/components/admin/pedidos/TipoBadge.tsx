export function TipoBadge({ tipo }: { tipo: string }) {
  const domicilio = tipo === "domicilio";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wide"
      style={
        domicilio
          ? { color: "#3B82F6", background: "rgba(59,130,246,0.15)" }
          : { color: "#A855F7", background: "rgba(168,85,247,0.15)" }
      }
    >
      {domicilio ? "🛵 Domicilio" : "🏪 Sede"}
    </span>
  );
}
