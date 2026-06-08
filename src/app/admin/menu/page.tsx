import { ErrorState } from "@/components/admin/ErrorState";
import { ProductsTable } from "@/components/admin/menu/ProductsTable";
import { getProductosAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuAdminPage() {
  try {
    const productos = await getProductosAdmin();
    return <ProductsTable productos={productos} />;
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
