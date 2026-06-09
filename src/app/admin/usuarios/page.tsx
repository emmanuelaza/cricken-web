import { UsuariosClient } from "@/components/admin/usuarios/UsuariosClient";
import { getAdminUsers } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsuariosPage() {
  const usuarios = await getAdminUsers();
  return <UsuariosClient usuarios={usuarios} />;
}
