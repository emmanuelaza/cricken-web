# Cricken — Perros Coreanos 🌭

Sitio web + catálogo QR para Cricken (perros coreanos, Medellín).
Next.js 16 (App Router) · TypeScript · Tailwind v4.

Hoy el sitio lee **datos estáticos** (el seed del setup de Supabase). Está
construido para cambiar a Supabase sin tocar la interfaz.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Páginas

| Ruta                     | Descripción                                          |
|--------------------------|------------------------------------------------------|
| `/`                      | Landing: hero, menú, combos, sedes, reseñas          |
| `/catalogo`              | Catálogo mobile-first para el QR (`?sede=centro`). Registra cada visita en `pedidos_qr`. |

## Estructura

```
src/
  app/                 páginas y rutas
    page.tsx           landing (secciones async con <Suspense> + skeletons)
    catalogo/page.tsx  catálogo QR (registra visita en pedidos_qr)
    catalogo/loading.tsx  skeleton de la ruta
  components/          Header, Footer, Hero, *Card, Badge, Section, Skeletons
  data/
    types.ts           tipos de dominio (espejo de las tablas de Supabase)
    menu.ts            seed de referencia (ya NO se usa en runtime)
  lib/
    data.ts            ⭐ acceso a datos — consultas live a Supabase
    format.ts          formato de pesos COP
    site.ts            contacto, redes y links de pedido (placeholders)
    supabase/          client.ts (browser) + server.ts (RSC)
```

## Supabase (conectado)

La app lee en vivo desde Supabase vía [src/lib/data.ts](src/lib/data.ts)
(`productos`, `combos` + `combo_items`, `sedes`, `resenas`) usando el cliente
servidor. Cada visita a `/catalogo` inserta una fila en `pedidos_qr`.

Las claves van en `.env.local` (no versionado). Si una tabla aparece vacía en la
web, corre sus `INSERT` (Paso 4) y verifica sus políticas `SELECT` (Paso 5) en el
SQL Editor de Supabase.

## Pendiente / placeholders a reemplazar

- `src/lib/site.ts`: número de WhatsApp, links de Instagram/TikTok/Rappi/DiDi.
- Imágenes reales de producto (hoy se usan emojis).
- CRM (`clientes` / `pedidos` con auth) — siguiente fase del setup.
