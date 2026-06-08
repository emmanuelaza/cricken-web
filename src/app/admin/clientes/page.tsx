import { ClientsTable } from "@/components/admin/clientes/ClientsTable";
import { getClientesAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await getClientesAdmin();

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold" style={{ color: "#888888" }}>
        {clientes.length} clientes registrados
      </p>
      <ClientsTable clientes={clientes} />
    </div>
  );
}
