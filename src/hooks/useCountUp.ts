"use client";

import { useEffect, useState } from "react";

// Cuenta de 0 al valor objetivo con ease-out cubic.
export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}
