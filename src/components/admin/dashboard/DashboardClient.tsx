"use client";

import { motion, type Variants } from "framer-motion";
import { Crown, DollarSign, ShoppingBag, Users } from "lucide-react";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { SalesChart } from "@/components/admin/dashboard/SalesChart";
import { TopProducts } from "@/components/admin/dashboard/TopProducts";
import type { DashboardData } from "@/lib/admin-data";
import { formatPriceCOP } from "@/lib/format";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export function DashboardClient({ data }: { data: DashboardData }) {
  const { kpis } = data;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          titulo="Pedidos hoy"
          valor={kpis.pedidosHoy}
          delta={`${kpis.pedidosHoyDelta} hoy`}
          icono={ShoppingBag}
          color="purple"
        />
        <KpiCard
          titulo="Ingresos mes"
          valor={kpis.ingresosMes}
          format={formatPriceCOP}
          icono={DollarSign}
          color="yellow"
        />
        <KpiCard
          titulo="Clientes total"
          valor={kpis.clientesTotal}
          delta={`${kpis.clientesMes} este mes`}
          icono={Users}
          color="green"
        />
        <KpiCard titulo="Clientes VIP" valor={kpis.vip} icono={Crown} color="purple" />
      </div>

      {/* Chart + Top */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <SalesChart data={data.ventasSemana} />
        <TopProducts data={data.topProductos} />
      </div>

      {/* Recientes */}
      <RecentOrders pedidos={data.recientes} />
    </motion.div>
  );
}
