import { EmptyState } from "@/components/admin/EmptyState";
import { ErrorState } from "@/components/admin/ErrorState";
import { ProductsTable } from "@/components/admin/menu/ProductsTable";
import type { Combo, Producto } from "@/data/types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuAdminPage() {
  try {
    const supabase = await createClient();

    const { data: productos, error } = await supabase
      .from("productos")
      .select("*")
      .order("orden");

    if (error) {
      return <ErrorState message={error.message} />;
    }

    const { data: combos } = await supabase
      .from("combos")
      .select("*, combo_items(texto, orden)")
      .order("orden");

    if (!productos || productos.length === 0) {
      return (
        <EmptyState
          icon="🌭"
          titulo="Sin productos"
          descripcion="La tabla productos de Supabase está vacía. Corre el seed (INSERT) o crea uno con “Agregar producto”."
        />
      );
    }

    return (
      <ProductsTable
        productos={productos as Producto[]}
        combos={(combos as Combo[]) ?? []}
      />
    );
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
