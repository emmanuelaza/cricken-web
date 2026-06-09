"use client";

import {
  Clock,
  Download,
  Heart,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Ticket,
  UserCog,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { PageLoader } from "@/components/admin/PageLoader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  bell?: boolean;
  proximo?: boolean;
}

const grupos: { label: string; items: NavItem[] }[] = [
  {
    label: "Principal",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag, bell: true },
    ],
  },
  {
    label: "Gestión",
    items: [
      { href: "/admin/clientes", label: "Clientes", icon: Users },
      { href: "/admin/menu", label: "Menú", icon: UtensilsCrossed },
      { href: "/admin/combos", label: "Combos", icon: Layers },
    ],
  },
  {
    label: "Config",
    items: [
      { href: "/admin/horarios", label: "Horarios", icon: Clock },
      { href: "/admin/usuarios", label: "Usuarios", icon: UserCog },
      { href: "#", label: "Cupones", icon: Ticket, proximo: true },
      { href: "#", label: "Fidelidad", icon: Heart, proximo: true },
    ],
  },
  {
    label: "Reportes",
    items: [
      { href: "/admin/reportes", label: "Exportar", icon: Download },
      { href: "/admin/historial", label: "Historial", icon: History },
    ],
  },
];

export function Sidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [navegando, startTransition] = useTransition();
  const { nuevos, marcarVistos } = useRealtimeOrders();
  const { logout } = useAdminAuth();

  useEffect(() => {
    if (pathname?.startsWith("/admin/pedidos")) marcarVistos();
  }, [pathname, marcarVistos]);

  // Navega mostrando el PageLoader instantáneamente.
  const irA = (href: string) => {
    onNavigate();
    if (href === pathname) return;
    startTransition(() => router.push(href));
  };

  return (
    <>
      {navegando && <PageLoader />}
      <aside
        className={`admin-scroll admin-sidebar fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col overflow-y-auto transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#111111",
          borderRight: "1px solid rgba(107,33,168,0.2)",
        }}
      >
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          onClick={(e) => {
            e.preventDefault();
            irA("/admin/dashboard");
          }}
          className="flex items-center gap-2 px-5 py-5"
        >
        <span className="text-2xl" aria-hidden>
          🌭
        </span>
        <span className="font-display text-2xl leading-none tracking-wide text-gradient">
          CRICKEN
        </span>
        <span
          className="font-display text-sm tracking-widest"
          style={{ color: "#888888" }}
        >
          CRM
        </span>
      </Link>

      <div style={{ borderTop: "1px solid rgba(107,33,168,0.2)" }} />

      <nav className="flex-1 px-3 py-4">
        {grupos.map((g) => (
          <div key={g.label} className="mb-5">
            <p
              className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest"
              style={{ color: "#555555" }}
            >
              {g.label}
            </p>
            {g.items.map((item) => {
              const Icon = item.icon;

              if (item.proximo) {
                return (
                  <div
                    key={item.label}
                    className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold"
                    style={{ color: "#555555" }}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[9px] font-black uppercase tracking-wide">
                      próximo
                    </span>
                  </div>
                );
              }

              const activo = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    irA(item.href);
                  }}
                  className="relative mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all"
                  style={{
                    background: activo ? "rgba(107,33,168,0.2)" : "transparent",
                    color: activo ? "#FFFFFF" : "#888888",
                    borderLeft: activo
                      ? "3px solid #6B21A8"
                      : "3px solid transparent",
                  }}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.bell && nuevos > 0 && (
                    <span
                      className="badge-nuevo grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[11px] font-black text-white"
                      style={{ background: "#EF4444" }}
                    >
                      {nuevos}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid rgba(107,33,168,0.2)" }}>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 px-5 py-4 text-sm font-bold transition-colors hover:text-white"
          style={{ color: "#888888" }}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
      </aside>
    </>
  );
}
