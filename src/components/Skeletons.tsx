// Skeletons de carga con la estética oscura de CRICKEN.
// Se muestran como fallback de <Suspense> mientras Supabase responde.

function Box({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-2 ${className}`}
      style={{ background: "#1A1A1A" }}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="animate-pulse p-5"
      style={{
        background: "#111111",
        borderRadius: "14px",
        border: "1px solid rgba(107,33,168,0.3)",
      }}
    >
      {children}
    </div>
  );
}

export function MenuSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <Box className="mb-4 h-24 w-full" />
          <Box className="h-4 w-2/3" />
          <Box className="mt-2 h-3 w-full" />
          <Box className="mt-1.5 h-3 w-5/6" />
          <div className="mt-4 flex items-center justify-between">
            <Box className="h-6 w-20" />
            <Box className="h-[30px] w-[30px]" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function CombosSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <Box className="h-3 w-24" />
          <Box className="mt-2 h-7 w-32" />
          <Box className="mt-4 h-8 w-28" />
          <div className="mt-6 space-y-3">
            <Box className="h-3 w-full" />
            <Box className="h-3 w-5/6" />
            <Box className="h-3 w-4/6" />
          </div>
          <Box className="mt-7 h-11 w-full" />
        </Card>
      ))}
    </div>
  );
}

export function SedesSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="flex items-center gap-3">
            <Box className="h-12 w-12" />
            <Box className="h-5 w-24" />
          </div>
          <Box className="mt-4 h-5 w-2/3" />
          <Box className="mt-2 h-3 w-1/2" />
          <Box className="mt-2 h-3 w-3/4" />
          <Box className="mt-5 h-4 w-28" />
        </Card>
      ))}
    </div>
  );
}

export function ResenasSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <Box className="h-4 w-24" />
          <Box className="mt-3 h-3 w-full" />
          <Box className="mt-1.5 h-3 w-full" />
          <Box className="mt-1.5 h-3 w-4/6" />
          <div className="mt-5 flex items-center gap-3">
            <Box className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Box className="h-3 w-24" />
              <Box className="mt-1.5 h-2.5 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
