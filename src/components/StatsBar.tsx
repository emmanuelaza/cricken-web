const stats = [
  { n: "24K", l: "Seguidores" },
  { n: "4.4★", l: "En Rappi" },
  { n: "3", l: "Sedes" },
  { n: "$9K", l: "Desde" },
];

export function StatsBar() {
  return (
    <section
      style={{
        background: "#111111",
        borderTop: "1px solid rgba(107,33,168,0.3)",
        borderBottom: "1px solid rgba(107,33,168,0.3)",
      }}
    >
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <dt className="font-display text-gradient leading-none [font-size:2.4rem]">
              {s.n}
            </dt>
            <dd className="mt-1 text-xs font-extrabold uppercase tracking-widest text-muted">
              {s.l}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
