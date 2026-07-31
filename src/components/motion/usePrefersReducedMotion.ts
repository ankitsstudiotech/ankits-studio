"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe reduced-motion preference. Defaults to `true` (no motion) until
 * mounted so the first paint never assumes animation is OK.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
