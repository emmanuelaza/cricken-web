"use client";

import Image from "next/image";
import { useState } from "react";
import { navLinks, site, whatsappLink } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md"
      style={{ borderBottom: "1px solid rgba(107,33,168,0.3)" }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="CRICKEN"
            width={150}
            height={150}
            priority
            className="h-10 w-auto rounded-full"
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-extrabold uppercase tracking-wide text-muted transition-colors hover:text-brand-light"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-brand px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-brand-light sm:inline-flex"
          >
            Pedir ya
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg text-white md:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <span className="text-xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="bg-bg md:hidden"
          style={{ borderTop: "1px solid rgba(107,33,168,0.3)" }}
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-extrabold uppercase tracking-wide text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="py-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white"
              >
                Pedir ya
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
