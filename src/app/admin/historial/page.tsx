import { HistorialClient } from "@/components/admin/historial/HistorialClient";
import { getHistorial } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HistorialPage() {
  const entradas = await getHistorial();
  return <HistorialClient entradas={entradas} />;
}
