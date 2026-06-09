import Link from "next/link";
import { ErrorState } from "@/components/admin/ErrorState";
import { OrderDetail } from "@/components/admin/pedidos/OrderDetail";
import { getPedidoAdmin, getPrimeraNotaPorTelefono } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const pedido = await getPedidoAdmin(id);

    if (!pedido) {
      return (
        <div className="py-16 text-center">
          <p className="text-4xl">⚠️</p>
          <p className="mt-3 font-bold" style={{ color: "#888888" }}>
            No encontramos este pedido.
          </p>
          <Link
            href="/admin/pedidos"
            className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-black uppercase text-white"
            style={{ background: "#6B21A8" }}
          >
            Volver a pedidos
          </Link>
        </div>
      );
    }

    const notaCliente = await getPrimeraNotaPorTelefono(pedido.cliente_telefono);
    return <OrderDetail pedido={pedido} notaCliente={notaCliente} />;
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
