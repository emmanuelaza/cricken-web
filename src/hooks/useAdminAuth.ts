"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Verifica la sesión admin en el cliente y expone logout + email del admin.
export function useAdminAuth() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setEmail(user.email ?? null);
      }
    });
  }, [router]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return { email, logout };
}
