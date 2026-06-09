import { createClient } from "@supabase/supabase-js";

// Cliente con service_role: SOLO servidor (server actions). Salta RLS y permite
// auth.admin.*. NUNCA importar en componentes de cliente.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en .env.local (necesaria para invitar usuarios).",
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
