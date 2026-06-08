import { ProductsTable } from "@/components/admin/menu/ProductsTable";
import { getProductosAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function MenuAdminPage() {
  const productos = await getProductosAdmin();
  return <ProductsTable productos={productos} />;
}
