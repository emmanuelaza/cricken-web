"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas");
      setCargando(false);
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  };

  const inputBase =
    "w-full rounded-lg px-4 py-3 font-bold text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#A855F7]";
  const inputStyle = {
    background: "#1A1A1A",
    border: "1px solid rgba(107,33,168,0.4)",
  } as const;

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5"
      style={{
        background:
          "radial-gradient(60% 60% at 15% 10%, rgba(107,33,168,0.35) 0%, transparent 60%), #0A0A0A",
      }}
    >
      <div
        className="w-full max-w-sm p-[1px]"
        style={{
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, #6B21A8 0%, #F07820 50%, #F5C018 100%)",
        }}
      >
        <div
          className="p-8"
          style={{ background: "#0A0A0A", borderRadius: "15px" }}
        >
          <div className="text-center">
            <span className="text-4xl" aria-hidden>
              🌭
            </span>
            <h1 className="mt-2 font-display text-4xl leading-none tracking-wide text-gradient">
              CRICKEN
            </h1>
            <p
              className="mt-1 text-[11px] font-black uppercase tracking-[0.3em]"
              style={{ color: "#888888" }}
            >
              Panel Administrativo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="📧  Email"
              className={inputBase}
              style={inputStyle}
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="🔒  Contraseña"
              className={inputBase}
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-lg py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-[#7C3AED] disabled:opacity-60"
              style={{ background: "#6B21A8" }}
            >
              {cargando ? "Ingresando…" : "Ingresar al panel"}
            </button>

            {error && (
              <p
                className="rounded-lg px-4 py-2.5 text-center text-sm font-bold"
                style={{
                  color: "#EF4444",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.4)",
                }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
