"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useToast } from "@/components/admin/Toast";
import type { BadgeTipo, CategoriaProducto, Producto } from "@/data/types";
import { createClient } from "@/lib/supabase/client";

const categorias: CategoriaProducto[] = ["salado", "dulce", "picante", "especial"];
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export function EditProductModal({
  producto,
  onClose,
}: {
  producto: Producto | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const esNuevo = !producto;
  // Id estable: el existente o uno nuevo (para nombrar el archivo de la foto).
  const idRef = useRef(producto?.id ?? crypto.randomUUID());
  const fileRef = useRef<HTMLInputElement>(null);

  const [emoji, setEmoji] = useState(producto?.emoji ?? "🌭");
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precio, setPrecio] = useState(String(producto?.precio ?? 0));
  const [categoria, setCategoria] = useState<CategoriaProducto>(producto?.categoria ?? "salado");
  const [badgeTexto, setBadgeTexto] = useState(producto?.badge_texto ?? "");
  const [badgeTipo, setBadgeTipo] = useState<BadgeTipo | "">(producto?.badge_tipo ?? "");
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [fotoUrl, setFotoUrl] = useState<string | null>(producto?.foto_url ?? null);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!TIPOS_OK.includes(file.type)) {
      toast("Formato no válido (usa JPG, PNG o WEBP)", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast("La imagen supera 2MB", "error");
      return;
    }
    setSubiendo(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${idRef.current}.${ext}`;
    const { error } = await supabase.storage
      .from("productos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setSubiendo(false);
      toast("No se pudo subir: " + error.message, "error");
      return;
    }
    const { data } = supabase.storage.from("productos").getPublicUrl(path);
    setFotoUrl(`${data.publicUrl}?t=${Date.now()}`);
    setSubiendo(false);
    toast("Foto subida ✅", "success");
  };

  const guardar = async () => {
    setGuardando(true);
    const supabase = createClient();
    const payload = {
      emoji,
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      precio: parseInt(precio, 10) || 0,
      categoria,
      badge_texto: badgeTexto.trim() || null,
      badge_tipo: badgeTipo || null,
      foto_url: fotoUrl,
      activo,
    };
    const { error } = esNuevo
      ? await supabase.from("productos").insert({ id: idRef.current, ...payload })
      : await supabase.from("productos").update(payload).eq("id", producto!.id);

    setGuardando(false);
    if (error) {
      toast("No se pudo guardar: " + error.message, "error");
      return;
    }
    toast(esNuevo ? "Producto creado" : "Producto actualizado", "success");
    onClose();
    router.refresh();
  };

  const inputBase =
    "w-full rounded-lg px-3 py-2 font-bold text-white outline-none transition-colors focus:border-[#A855F7]";
  const inputStyle = { background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.3)" } as const;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-label="Editar producto"
        className="admin-scroll relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto p-6"
        style={{
          background: "#111111",
          borderRadius: "12px",
          border: "1px solid rgba(107,33,168,0.5)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide text-white">
            {esNuevo ? "Nuevo producto" : "Editar producto"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-lg" style={{ color: "#888888" }}>
            ✕
          </button>
        </div>

        {/* Foto */}
        <div className="mt-5">
          <p className="mb-1 text-[11px] font-black uppercase tracking-wide" style={{ color: "#888888" }}>
            Foto
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {fotoUrl ? (
            <div className="flex items-center gap-3">
              <Image
                src={fotoUrl}
                alt="preview"
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-lg object-cover"
                style={{ border: "1px solid rgba(107,33,168,0.3)" }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={subiendo}
                className="rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide text-white disabled:opacity-60"
                style={{ background: "#6B21A8" }}
              >
                {subiendo ? "Subiendo…" : "Cambiar foto"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={subiendo}
              className="flex w-full flex-col items-center justify-center gap-1 py-6 text-center text-sm font-bold disabled:opacity-60"
              style={{
                background: "#1A1A1A",
                border: "2px dashed rgba(107,33,168,0.5)",
                borderRadius: "8px",
                color: "#888888",
              }}
            >
              <span className="text-2xl" aria-hidden>📷</span>
              {subiendo ? "Subiendo…" : "Arrastra tu foto aquí o haz clic para seleccionar"}
            </button>
          )}
          <p className="mt-1 text-[10px] font-bold" style={{ color: "#555555" }}>
            JPG, PNG o WEBP · máx 2MB
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <Field label="Emoji">
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className={`${inputBase} text-center`} style={inputStyle} />
            </Field>
            <Field label="Nombre">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputBase} style={inputStyle} />
            </Field>
          </div>
          <Field label="Descripción">
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} className={`${inputBase} resize-none`} style={inputStyle} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio">
              <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className={inputBase} style={inputStyle} />
            </Field>
            <Field label="Categoría">
              <select value={categoria} onChange={(e) => setCategoria(e.target.value as CategoriaProducto)} className={`${inputBase} capitalize`} style={inputStyle}>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Badge texto">
              <input value={badgeTexto} onChange={(e) => setBadgeTexto(e.target.value)} placeholder="⭐ Popular" className={inputBase} style={inputStyle} />
            </Field>
            <Field label="Badge tipo">
              <select value={badgeTipo} onChange={(e) => setBadgeTipo(e.target.value as BadgeTipo | "")} className={inputBase} style={inputStyle}>
                <option value="">Ninguno</option>
                <option value="yellow">Amarillo</option>
                <option value="purple">Morado</option>
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Activo (visible en la web)
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide" style={{ color: "#888888", border: "1px solid #333333" }}>
            Cancelar
          </button>
          <button type="button" onClick={guardar} disabled={guardando || subiendo} className="rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60" style={{ background: "#6B21A8" }}>
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-black uppercase tracking-wide" style={{ color: "#888888" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
