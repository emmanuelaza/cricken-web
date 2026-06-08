import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";
import { getDashboardData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
