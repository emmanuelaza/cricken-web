import { HorariosClient } from "@/components/admin/horarios/HorariosClient";
import { getConfigNegocio, getHorarios } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HorariosPage() {
  const [config, horarios] = await Promise.all([
    getConfigNegocio(),
    getHorarios(),
  ]);
  return <HorariosClient config={config} horarios={horarios} />;
}
