import Link from "next/link";
import { ClientDetail } from "@/components/admin/clientes/ClientDetail";
import { getClienteAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getClienteAdmin(id);

  if (!cliente) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl">⚠️</p>
        <p className="mt-3 font-bold" style={{ color: "#888888" }}>
          No encontramos este cliente.
        </p>
        <Link
          href="/admin/clientes"
          className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-black uppercase text-white"
          style={{ background: "#6B21A8" }}
        >
          Volver a clientes
        </Link>
      </div>
    );
  }

  return <ClientDetail cliente={cliente} />;
}
