// Skeleton de la ruta /catalogo mientras Supabase responde.
function Box({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ background: "#1A1A1A" }}
    />
  );
}

export default function Loading() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-bg pb-28">
      <header
        className="px-5 pb-7 pt-10 text-center"
        style={{
          background:
            "radial-gradient(70% 90% at 50% 0%, rgba(107,33,168,0.4) 0%, transparent 70%), #0A0A0A",
        }}
      >
        <Box className="mx-auto h-10 w-40" />
        <Box className="mx-auto mt-2 h-3 w-28" />
      </header>

      <main className="px-5">
        {Array.from({ length: 3 }).map((_, s) => (
          <section key={s} className="mt-7">
            <Box className="h-6 w-32" />
            <ul className="mt-3 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Box className="h-11 w-11 shrink-0" />
                  <div className="flex-1">
                    <Box className="h-4 w-1/2" />
                    <Box className="mt-2 h-3 w-3/4" />
                  </div>
                  <Box className="h-5 w-14 shrink-0" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
