import { getConfigNegocio } from "@/lib/data";

// Banner público cuando los pedidos online están desactivados.
export async function ClosedBanner() {
  const config = await getConfigNegocio();
  if (config.pedidos_activos) return null;

  return (
    <div
      className="w-full px-5 py-3 text-center text-sm font-black"
      style={{ background: "#4C1D95", color: "#FFFFFF" }}
    >
      🌭 {config.mensaje_cerrado ?? "Estamos cerrados por ahora."}
    </div>
  );
}
