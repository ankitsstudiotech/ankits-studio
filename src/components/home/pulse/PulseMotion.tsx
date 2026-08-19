import type { ReactNode } from "react";
import styles from "./pulse-home.module.css";

/** Homepage service tempos — retained for content mapping; not used for motion forks. */
export type ServiceTempo =
  | "functional"
  | "yoga"
  | "zumba"
  | "dance"
  | "wedding"
  | "home"
  | "online";

/**
 * Conversion CTA — CSS press feedback (module `.cta:hover` / `:active`).
 * Kept free of `motion/react` so the hero island does not pay for the library.
 */
export function PulseCta({
  href,
  children,
  external,
  id,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  id?: string;
}) {
  const isExternal = external ?? href.startsWith("http");
  return (
    <a
      id={id}
      href={href}
      className={styles.cta}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

/**
 * Replaceable media fallback plate.
 * Real assets swap in via docs/media/STUDIO-MEDIA-REQUIREMENTS.md — do not treat
 * gradients as permanent proof of place.
 */
export function PulseMediaPlate({
  family,
  label,
  aspect = "4/5",
  className = "",
  slotKey,
  compact = false,
}: {
  family: "strength" | "calm" | "high-energy" | "warm";
  label: string;
  aspect?: "3/4" | "4/5" | "16/9" | "1/1" | "21/9";
  className?: string;
  /** Stable content key from STUDIO-MEDIA-REQUIREMENTS.md */
  slotKey?: string;
  /** Shorter strip — use on detail heroes until real photography ships */
  compact?: boolean;
}) {
  return (
    <div
      data-media-slot={slotKey}
      data-media-status="fallback"
      data-mock-media="true"
      data-mock-media-family={family}
      className={[
        styles.mediaPlate,
        styles.mediaFallback,
        compact ? styles.mediaPlateCompact : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={compact ? undefined : { aspectRatio: aspect.replace("/", " / ") }}
      role="img"
      aria-label={label}
    />
  );
}
