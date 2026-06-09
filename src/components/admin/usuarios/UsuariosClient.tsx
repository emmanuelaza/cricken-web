"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { invitarUsuario } from "@/app/admin/usuarios/actions";
import { EmptyState } from "@/components/admin/EmptyState";
import { useToast } from "@/components/admin/Toast";
import type { AdminUser, RolAdmin } from "@/data/types";
import { sedesFallback } from "@/lib/site";

const roles: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  dueno: { color: "#F5C018", bg: "rgba(245,192,24,0.15)", label: "Dueño", icon: "👑" },
  encargado: { color: "#A855F7", bg: "rgba(168,85,247,0.15)", label: "Encargado", icon: "🏪" },
  cajero: { color: "#3B82F6", bg: "rgba(59,130,246,0.15)", label: "Cajero", icon: "💰" },
};

function RoleBadge({ rol }: { rol: string }) {
  const r = roles[rol] ?? roles.cajero;
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wide" style={{ color: r.color, background: r.bg }}>
      {r.icon} {r.label}
    </span>
  );
}

const inputBase =
  "w-full rounded-lg px-3 py-2 font-bold text-white outline-none focus:border-[#A855F7]";
const inputStyle = { background: "#1A1A1A", border: "1px solid rgba(107,33,168,0.3)" } as const;

export function UsuariosClient({ usuarios }: { usuarios: AdminUser[] }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolAdmin>("encargado");
  const [sede, setSede] = useState("");
  const [enviando, setEnviando] = useState(false);

  const invitar = async () => {
    setEnviando(true);
    const res = await invitarUsuario({ nombre, email, rol, sede });
    setEnviando(false);
    if (res?.error) {
      toast(res.error, "error");
      return;
    }
    toast("Invitación enviada ✅", "success");
    setOpen(false);
    setNombre("");
    setEmail("");
    setSede("");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED]"
          style={{ background: "#6B21A8" }}
        >
          <Plus size={16} /> Invitar usuario
        </button>
      </div>

      {usuarios.length === 0 ? (
        <EmptyState
          icon="🧑‍🍳"
          titulo="Sin usuarios"
          descripcion="Invita a tu equipo. Requiere la tabla admin_users y la service_role key."
        />
      ) : (
        <div className="admin-scroll overflow-x-auto" style={{ background: "#111111", borderRadius: "12px", border: "1px solid rgba(107,33,168,0.2)" }}>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr style={{ color: "#555555" }}>
                {["Nombre", "Email", "Rol", "Sede", "Activo"].map((h) => (
                  <th key={h} className="px-3 py-3 text-[11px] font-black uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-[#222222]" style={{ borderTop: "1px solid rgba(107,33,168,0.1)" }}>
                  <td className="px-3 py-3 font-bold text-white">{u.nombre}</td>
                  <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>{u.email}</td>
                  <td className="px-3 py-3"><RoleBadge rol={u.rol} /></td>
                  <td className="px-3 py-3 font-bold" style={{ color: "#888888" }}>{u.sede ?? "—"}</td>
                  <td className="px-3 py-3">{u.activo ? "✅" : "🔴"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div onClick={() => setOpen(false)} aria-hidden className="absolute inset-0 bg-black/70" />
          <div role="dialog" aria-label="Invitar usuario" className="relative z-10 w-full max-w-md p-6" style={{ background: "#111111", borderRadius: "12px", border: "1px solid rgba(107,33,168,0.5)", boxShadow: "0 25px 80px rgba(0,0,0,0.8)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-wide text-white">Invitar usuario</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-lg" style={{ color: "#888888" }}>✕</button>
            </div>
            <div className="mt-5 space-y-3">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className={inputBase} style={inputStyle} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputBase} style={inputStyle} />
              <select value={rol} onChange={(e) => setRol(e.target.value as RolAdmin)} className={inputBase} style={inputStyle}>
                <option value="dueno">👑 Dueño</option>
                <option value="encargado">🏪 Encargado</option>
                <option value="cajero">💰 Cajero</option>
              </select>
              <select value={sede} onChange={(e) => setSede(e.target.value)} className={inputBase} style={inputStyle}>
                <option value="">Sin sede asignada</option>
                {sedesFallback.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide" style={{ color: "#888888", border: "1px solid #333333" }}>
                Cancelar
              </button>
              <button type="button" onClick={invitar} disabled={enviando} className="rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60" style={{ background: "#6B21A8" }}>
                {enviando ? "Enviando…" : "Enviar invitación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
