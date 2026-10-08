import Link from "next/link";
import { getActiveSeasonalPromos } from "@/content";
import styles from "./garba-night.module.css";

export type GarbaInternalPromoProps = {
  context: "dance" | "airoli";
};

/** Contextual event promo for Dance + Airoli location pages. */
export function GarbaInternalPromo({ context }: GarbaInternalPromoProps) {
  const [event] = getActiveSeasonalPromos();
  if (!event) return null;

  const lead =
    context === "dance"
      ? "Ankit's Studio presents Garba Night — 5th Edition on 17 October in Airoli."
      : "Garba Night — 5th Edition is at VIBGYOR High School, Airoli on 17 October 2026.";

  return (
    <aside className={styles.internalPromo} aria-label="Garba Night 2026">
      <p className={styles.internalPromoText}>{lead}</p>
      <Link href={event.path}>View Garba Night →</Link>
    </aside>
  );
}
