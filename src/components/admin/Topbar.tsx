"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const titulos: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/pedidos": "Pedidos",
  "/admin/clientes": "Clientes",
  "/admin/menu": "Gestión de Menú",
};

function tituloDe(pathname: string | null): string {
  if (!pathname) return "Panel";
  const match = Object.keys(titulos).find((k) => pathname.startsWith(k));
  return match ? titulos[match] : "Panel";
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { email } = useAdminAuth();
  const [ahora, setAhora] = useState<string>("");

  useEffect(() => {
    const update = () =>
      setAhora(
        new Date().toLocaleString("es-CO", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const iniciales = (email ?? "AD").slice(0, 2).toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:px-6"
      style={{
        background: "#0A0A0A",
        borderBottom: "1px solid rgba(107,33,168,0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menú"
          className="grid h-9 w-9 place-items-center rounded-lg text-white md:hidden"
          style={{ background: "#1A1A1A" }}
        >
          <Menu size={18} />
        </button>
        <h1 className="font-display text-2xl tracking-wide text-white">
          {tituloDe(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span
          className="hidden text-xs font-bold capitalize sm:block"
          style={{ color: "#888888" }}
        >
          {ahora}
        </span>
        <div
          className="grid h-9 w-9 place-items-center rounded-full text-xs font-black text-white"
          style={{ background: "linear-gradient(135deg, #4C1D95, #7C3AED)" }}
          title={email ?? undefined}
        >
          {iniciales}
        </div>
      </div>
    </header>
  );
}
