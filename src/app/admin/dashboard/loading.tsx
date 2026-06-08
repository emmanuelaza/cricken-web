import { KpiSkeleton } from "@/components/admin/skeletons/KpiSkeleton";
import { TableSkeleton } from "@/components/admin/skeletons/TableSkeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <KpiSkeleton />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div
          className="admin-skeleton"
          style={{ height: 290, borderRadius: 12 }}
        />
        <div
          className="admin-skeleton"
          style={{ height: 290, borderRadius: 12 }}
        />
      </div>
      <TableSkeleton cols={5} />
    </div>
  );
}
