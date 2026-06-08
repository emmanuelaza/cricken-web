export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-5"
          style={{
            background: "#111111",
            borderRadius: "12px",
            border: "1px solid rgba(107,33,168,0.2)",
          }}
        >
          <div className="admin-skeleton h-3 w-2/3" />
          <div className="admin-skeleton mt-3 h-9 w-1/2" />
          <div className="admin-skeleton mt-3 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}
