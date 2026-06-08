import Image from "next/image";
import { site, whatsappLink } from "@/lib/site";

const social = [
  { label: "Instagram", href: site.instagram },
  { label: "TikTok", href: site.tiktok },
];

export function Footer() {
  return (
    <footer
      className="mt-auto bg-bg text-white"
      style={{ borderTop: "1px solid rgba(107,33,168,0.3)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Image
            src="/logo.jpg"
            alt="CRICKEN"
            width={150}
            height={150}
            className="h-[50px] w-auto rounded-full"
          />
          <p className="mt-3 text-sm font-bold text-muted">{site.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-muted">
            Pedidos
          </h4>
          <ul className="mt-3 space-y-2 text-sm font-bold">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-yellow">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.rappi} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-yellow">
                Rappi
              </a>
            </li>
            <li>
              <a href={site.didi} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-yellow">
                DiDi Food
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-muted">
            Síguenos
          </h4>
          <div className="mt-3 flex gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-4 py-2 text-sm font-black text-white transition-colors hover:border-brand hover:text-brand-light"
                style={{
                  background: "#1A1A1A",
                  border: "1px solid rgba(107,33,168,0.3)",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(107,33,168,0.2)" }}>
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs font-bold text-muted">
          © {new Date().getFullYear()} {site.name}. Hecho en Medellín 🇨🇴
        </p>
      </div>
    </footer>
  );
}
