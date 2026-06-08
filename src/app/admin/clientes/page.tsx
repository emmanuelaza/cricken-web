import { ClientsTable } from "@/components/admin/clientes/ClientsTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorState } from "@/components/admin/ErrorState";
import { getClientesAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClientesPage() {
  try {
    const clientes = await getClientesAdmin();

    return (
      <div className="space-y-4">
        <p className="text-sm font-bold" style={{ color: "#888888" }}>
          {clientes.length} clientes registrados
        </p>
        {clientes.length === 0 ? (
          <EmptyState
            icon="👥"
            titulo="Sin clientes aún"
            descripcion="Se crean automáticamente cuando alguien hace un pedido."
          />
        ) : (
          <ClientsTable clientes={clientes} />
        )}
      </div>
    );
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
