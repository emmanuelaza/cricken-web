import { ErrorState } from "@/components/admin/ErrorState";
import { ReportesClient } from "@/components/admin/reportes/ReportesClient";
import {
  getClientesAdmin,
  getPedidosAdmin,
  getProductosAdmin,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReportesPage() {
  try {
    const [pedidos, clientes, productos] = await Promise.all([
      getPedidosAdmin(),
      getClientesAdmin(),
      getProductosAdmin(),
    ]);
    return (
      <ReportesClient pedidos={pedidos} clientes={clientes} productos={productos} />
    );
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
