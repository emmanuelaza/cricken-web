"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { useToast } from "@/components/admin/Toast";
import type { Cliente, Pedido, Producto } from "@/data/types";

const hoyISO = () => new Date().toISOString().slice(0, 10);

function descargar(rows: Record<string, unknown>[], hoja: string, archivo: string) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, hoja);
  XLSX.writeFile(wb, archivo);
}

const panel = {
  background: "#111111",
  borderRadius: "12px",
  border: "1px solid rgba(107,33,168,0.2)",
} as const;
const inputStyle = {
  background: "#1A1A1A",
  border: "1px solid rgba(107,33,168,0.3)",
} as const;
const btn =
  "rounded-lg px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]";

export function ReportesClient({
  pedidos,
  clientes,
  productos,
}: {
  pedidos: Pedido[];
  clientes: Cliente[];
  productos: Producto[];
}) {
  const toast = useToast();
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  const exportarPedidos = () => {
    const desde = inicio ? new Date(inicio + "T00:00:00") : null;
    const hasta = fin ? new Date(fin + "T23:59:59") : null;
    const filtrados = pedidos.filter((p) => {
      const f = new Date(p.created_at);
      if (desde && f < desde) return false;
      if (hasta && f > hasta) return false;
      return true;
    });
    if (filtrados.length === 0) {
      toast("No hay pedidos en ese rango", "info");
      return;
    }
    const rows = filtrados.map((p) => ({
      ID: `CR-${p.id.slice(0, 6).toUpperCase()}`,
      Fecha: new Date(p.created_at).toLocaleString("es-CO"),
      Cliente: p.cliente_nombre,
      Teléfono: p.cliente_telefono,
      Productos: (p.productos ?? [])
        .map((x) => `${x.cantidad}x ${x.nombre}`)
        .join(", "),
      Total: p.total,
      Sede: p.sede ?? "",
      Tipo: p.tipo_pedido,
      Estado: p.estado,
      Canal: p.canal,
      Dirección: p.direccion ?? "",
      Barrio: p.barrio ?? "",
    }));
    descargar(rows, "Pedidos", `cricken-pedidos-${hoyISO()}.xlsx`);
    toast("Pedidos exportados ✅", "success");
  };

  const exportarClientes = () => {
    if (clientes.length === 0) {
      toast("No hay clientes", "info");
      return;
    }
    const rows = clientes.map((c) => ({
      Nombre: c.nombre,
      Teléfono: c.telefono ?? "",
      Email: c.email ?? "",
      Segmento: c.segmento,
      "Total pedidos": c.total_pedidos ?? 0,
      "Total gastado": c.total_gastado ?? 0,
      "Sede favorita": c.sede_favorita ?? "",
      "Fecha registro": c.created_at
        ? new Date(c.created_at).toLocaleDateString("es-CO")
        : "",
    }));
    descargar(rows, "Clientes", `cricken-clientes-${hoyISO()}.xlsx`);
    toast("Clientes exportados ✅", "success");
  };

  const exportarProductos = () => {
    if (productos.length === 0) {
      toast("No hay productos", "info");
      return;
    }
    const rows = productos.map((p) => ({
      Nombre: p.nombre,
      Categoría: p.categoria,
      Precio: p.precio,
      Descripción: p.descripcion ?? "",
      Badge: p.badge_texto ?? "",
      Activo: p.activo ? "Sí" : "No",
    }));
    descargar(rows, "Menú", `cricken-menu-${hoyISO()}.xlsx`);
    toast("Menú exportado ✅", "success");
  };

  return (
    <div className="max-w-xl space-y-5">
      <div className="p-5" style={panel}>
        <h2 className="font-display text-xl tracking-wide text-white">
          Exportar datos
        </h2>

        <div className="mt-5">
          <p className="text-sm font-black text-white">Pedidos</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-white outline-none"
              style={inputStyle}
            />
            <input
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-white outline-none"
              style={inputStyle}
            />
            <button type="button" onClick={exportarPedidos} className={btn} style={{ background: "#6B21A8" }}>
              Exportar pedidos a Excel
            </button>
          </div>
        </div>

        <div className="mt-5" style={{ borderTop: "1px solid rgba(107,33,168,0.15)", paddingTop: "1.25rem" }}>
          <p className="text-sm font-black text-white">Clientes</p>
          <button type="button" onClick={exportarClientes} className={`${btn} mt-2`} style={{ background: "#6B21A8" }}>
            Exportar todos los clientes
          </button>
        </div>

        <div className="mt-5" style={{ borderTop: "1px solid rgba(107,33,168,0.15)", paddingTop: "1.25rem" }}>
          <p className="text-sm font-black text-white">Productos</p>
          <button type="button" onClick={exportarProductos} className={`${btn} mt-2`} style={{ background: "#6B21A8" }}>
            Exportar menú completo
          </button>
        </div>
      </div>
    </div>
  );
}
