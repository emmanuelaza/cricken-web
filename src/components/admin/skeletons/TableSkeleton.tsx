export function TableSkeleton({ cols = 7 }: { cols?: number }) {
  return (
    <div
      className="overflow-hidden p-4"
      style={{
        background: "#111111",
        borderRadius: "12px",
        border: "1px solid rgba(107,33,168,0.2)",
      }}
    >
      {/* Header */}
      <div className="flex gap-3 pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="admin-skeleton h-3 flex-1" />
        ))}
      </div>
      {/* Filas */}
      {Array.from({ length: 5 }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-3 py-3"
          style={{ borderTop: "1px solid rgba(107,33,168,0.08)" }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="admin-skeleton h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
