import type { Metadata } from "next";
import { Bebas_Neue, Nunito } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cricken — Perros Coreanos en Medellín",
  description:
    "Perros coreanos crocantes, dulces y picantes en Medellín. Dori Dog, Papa Dog, Takis Dog y más. Combos, domicilios y 3 sedes.",
  keywords: [
    "perros coreanos",
    "korean hot dog",
    "Medellín",
    "comida coreana",
    "Cricken",
  ],
  openGraph: {
    title: "Cricken — Perros Coreanos en Medellín",
    description:
      "Perros coreanos crocantes, dulces y picantes. Combos y domicilios en Medellín.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebas.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
