import { NewOrderBell } from "@/components/admin/pedidos/NewOrderBell";
import { OrdersTable } from "@/components/admin/pedidos/OrdersTable";
import { getPedidosAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const pedidos = await getPedidosAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: "#888888" }}>
          {pedidos.length} pedidos en total
        </p>
        <NewOrderBell />
      </div>
      <OrdersTable pedidos={pedidos} />
    </div>
  );
}
