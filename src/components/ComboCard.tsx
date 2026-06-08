import type { Combo } from "@/data/types";
import { formatCOP } from "@/lib/format";
import { whatsappLink } from "@/lib/site";

export function ComboCard({ combo }: { combo: Combo }) {
  const featured = combo.featured;

  return (
    <article
      className="relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#111111",
        borderRadius: "14px",
        border: featured
          ? "2px solid #F5C018"
          : "1px solid rgba(107,33,168,0.3)",
        boxShadow: featured ? "0 0 40px rgba(245,192,24,0.18)" : undefined,
      }}
    >
      {featured && (
        <div className="bg-yellow py-2 text-center text-sm font-black uppercase tracking-widest text-bg">
          🔥 Mejor valor
        </div>
      )}

      <div className="flex flex-1 flex-col p-7">
        <p className="text-sm font-extrabold uppercase tracking-wide text-muted">
          {combo.tier}
        </p>
        <h3 className="font-display text-3xl tracking-wide text-white">
          {combo.nombre}
        </h3>

        <div className="mt-4">
          <span className="font-display leading-none text-yellow [font-size:2rem]">
            {formatCOP(combo.precio)}
          </span>
          {combo.precio_label && (
            <p className="mt-1 text-sm font-bold text-muted">
              {combo.precio_label}
            </p>
          )}
        </div>

        <ul className="mt-6 flex-1 space-y-3">
          {combo.combo_items.map((item) => (
            <li
              key={item.orden}
              className="flex items-start gap-2.5 text-sm font-bold text-white/90"
            >
              <span className="mt-0.5 text-brand-light" aria-hidden>
                ✓
              </span>
              <span>{item.texto}</span>
            </li>
          ))}
        </ul>

        <a
          href={whatsappLink(`¡Hola Cricken! Quiero el combo ${combo.nombre} 🌭`)}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-7 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-black uppercase tracking-wide transition-colors ${
            featured
              ? "bg-yellow text-bg hover:brightness-110"
              : "bg-brand text-white hover:bg-brand-light"
          }`}
        >
          Pedir por WhatsApp
        </a>
      </div>
    </article>
  );
}
