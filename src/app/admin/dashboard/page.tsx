import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";
import { ErrorState } from "@/components/admin/ErrorState";
import { getDashboardData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  try {
    const data = await getDashboardData();
    return <DashboardClient data={data} />;
  } catch (e) {
    return <ErrorState message={e instanceof Error ? e.message : undefined} />;
  }
}
