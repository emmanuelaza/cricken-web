"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { ToastProvider } from "@/components/admin/Toast";
import { Topbar } from "@/components/admin/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // El login no lleva sidebar ni topbar.
  if (pathname === "/admin/login") {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <Sidebar open={mobileOpen} onNavigate={() => setMobileOpen(false)} />

        {/* Backdrop móvil */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            aria-hidden
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
          />
        )}

        <div className="md:ml-[220px]">
          <Topbar onMenu={() => setMobileOpen(true)} />
          <main className="admin-scroll p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
