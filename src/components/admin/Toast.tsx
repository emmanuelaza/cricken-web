"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type ToastTipo = "success" | "error" | "info";

interface Toast {
  id: string;
  mensaje: string;
  tipo: ToastTipo;
}

interface ToastContextValue {
  toast: (mensaje: string, tipo?: ToastTipo) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const estilos: Record<ToastTipo, { borde: string; icon: string }> = {
  success: { borde: "#22C55E", icon: "✅" },
  error: { borde: "#EF4444", icon: "❌" },
  info: { borde: "#6B21A8", icon: "ℹ️" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((mensaje: string, tipo: ToastTipo = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-2xl"
            style={{
              background: "#1A1A1A",
              border: `1px solid ${estilos[t.tipo].borde}`,
            }}
          >
            <span aria-hidden>{estilos[t.tipo].icon}</span>
            {t.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx.toast;
}
