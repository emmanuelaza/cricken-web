import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorState } from "@/components/admin/ErrorState";
import { NewOrderBell } from "@/components/admin/pedidos/NewOrderBell";
import { OrdersTable } from "@/components/admin/pedidos/OrdersTable";
import { getPedidosAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PedidosPage() {
  try {
    const pedidos = await getPedidosAdmin();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: "#888888" }}>
            {pedidos.length} pedidos en total
          </p>
          <NewOrderBell />
        </div>
        {pedidos.length === 0 ? (
          <EmptyState
            icon="📦"
            titulo="Sin pedidos aún"
            descripcion="Los pedidos de la web aparecerán aquí en tiempo real."
          />
        ) : (
          <OrdersTable pedidos={pedidos} />
        )}
      </div>
    );
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
