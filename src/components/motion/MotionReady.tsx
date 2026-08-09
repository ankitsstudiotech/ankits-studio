"use client";

import { useEffect } from "react";

/**
 * Marks document for CSS-enhanced motion after hydration.
 * Kept out of PulseReveal so chrome does not pull `motion/react` for a null component.
 */
export function MotionReady() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    root.classList.remove("motion-pending");
    return () => {
      root.classList.remove("motion-ready");
    };
  }, []);
  return null;
}
