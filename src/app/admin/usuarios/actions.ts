"use server";

import type { RolAdmin } from "@/data/types";
import { createAdminClient } from "@/lib/supabase/admin";

export interface InvitarInput {
  nombre: string;
  email: string;
  rol: RolAdmin;
  sede?: string;
}

// Invita un usuario por email (Supabase Auth) y lo registra en admin_users.
// Requiere SUPABASE_SERVICE_ROLE_KEY real en .env.local.
export async function invitarUsuario(
  input: InvitarInput,
): Promise<{ error?: string }> {
  const nombre = input.nombre?.trim();
  const email = input.email?.trim().toLowerCase();
  if (!nombre || !email) return { error: "Nombre y email son obligatorios." };

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Falta service_role." };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
  if (error) {
    return { error: "No se pudo invitar: " + error.message };
  }

  const { error: insertError } = await admin.from("admin_users").insert({
    id: data.user?.id,
    nombre,
    email,
    rol: input.rol,
    sede: input.sede?.trim() || null,
    activo: true,
  });
  if (insertError) {
    return { error: "Usuario invitado, pero no se registró: " + insertError.message };
  }

  return {};
}
