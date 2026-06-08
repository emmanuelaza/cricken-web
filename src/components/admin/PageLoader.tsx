"use client";

import { motion } from "framer-motion";

// Pantalla de carga entre navegaciones del CRM.
export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center"
      style={{ background: "#0A0A0A" }}
    >
      <h1 className="font-display text-5xl leading-none tracking-wide text-gradient">
        CRICKEN
      </h1>

      <div
        className="mt-4 overflow-hidden"
        style={{ width: 200, height: 2, background: "#1A1A1A", borderRadius: 2 }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "60%",
            height: "100%",
            background:
              "linear-gradient(135deg, #6B21A8, #F07820, #F5C018)",
          }}
        />
      </div>

      <p
        className="mt-3 text-[12px] font-black uppercase tracking-[0.3em]"
        style={{ color: "#888888" }}
      >
        Cargando…
      </p>
    </div>
  );
}
