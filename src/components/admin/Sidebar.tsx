"use client";

import {
  LayoutDashboard,
  LogOut,
  MapPin,
  ShoppingBag,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";

const grupos = [
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
    ],
  },
];

const sedes = ["Centro", "Manrique", "Food Truck"];

export function Sidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const { nuevos, marcarVistos } = useRealtimeOrders();
  const { logout } = useAdminAuth();

  useEffect(() => {
    if (pathname?.startsWith("/admin/pedidos")) marcarVistos();
  }, [pathname, marcarVistos]);

  return (
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
        onClick={onNavigate}
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
              const activo = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
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

        <div className="mb-5">
          <p
            className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest"
            style={{ color: "#555555" }}
          >
            Sedes
          </p>
          {sedes.map((s) => (
            <div
              key={s}
              className="mb-1 flex items-center gap-3 px-3 py-2 text-sm font-bold"
              style={{ color: "#888888" }}
            >
              <MapPin size={16} style={{ color: "#555555" }} />
              {s}
            </div>
          ))}
        </div>
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
  );
}
