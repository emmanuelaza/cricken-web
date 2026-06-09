import { CombosTable } from "@/components/admin/combos/CombosTable";
import { ErrorState } from "@/components/admin/ErrorState";
import { getCombosAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CombosPage() {
  try {
    const combos = await getCombosAdmin();
    return <CombosTable combos={combos} />;
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
