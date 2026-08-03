import Link from "next/link";
import type { Branch } from "@/content";
import { getBranchMapsUrl } from "@/content";
import { WHATSAPP_REVIEW_HELPER } from "@/lib/conversion";
import { LocationPulseCta } from "./LocationPulseMotion";
import styles from "./location-pulse.module.css";

export type LocationDiscoveryProps = {
  branches: Branch[];
  trialHref: string;
  trialLabel: string;
};

/**
 * Place-first branch index — locality names lead; not a four-card grid.
 * SSR locality names + crawlable anchors. One WhatsApp CTA for the page.
 */
export function LocationDiscovery({ branches, trialHref, trialLabel }: LocationDiscoveryProps) {
  return (
    <section className={`${styles.field} ${styles.band}`} aria-labelledby="locations-index-title">
      <h1 id="locations-index-title" className={styles.bandTitle}>
        Four neighbourhood studios
      </h1>
      <p className={styles.bandLede}>
        Ankit’s Studio branches in Airoli, Ghansoli, and Thane. Message WhatsApp for current batch
        times. A free trial is available.
      </p>

      <ul className={styles.placeList}>
        {branches.map((branch) => {
          const mapsUrl = getBranchMapsUrl(branch);
          const addressLine = branch.address
            ? branch.address.replace(/,\s*Maharashtra\s+\d{6}$/i, "")
            : null;

          return (
            <li key={branch.slug} className={styles.placeRow}>
              <div>
                <h2 className={styles.placeName}>
                  <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
                </h2>
                <p className={styles.placeStatus}>Open daily · 6:00 AM–10:00 PM</p>
                {addressLine ? <p className={styles.placeAddress}>{addressLine}</p> : null}
              </div>
              <p className={styles.placeMeta}>
                {mapsUrl
                  ? "Neighbourhood studio — address, Maps link, and free trial enquiry."
                  : "Neighbourhood studio — message WhatsApp for directions while the map updates."}
              </p>
              <div className={styles.placeActions}>
                <Link href={`/locations/${branch.slug}`} className={styles.actionLink}>
                  Branch page
                </Link>
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    className={styles.actionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                ) : (
                  <span className={styles.actionMuted}>Maps updating</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.ctaRow}>
        <LocationPulseCta href={trialHref}>{trialLabel}</LocationPulseCta>
        <p className={styles.ctaNote}>{WHATSAPP_REVIEW_HELPER}</p>
      </div>
    </section>
  );
}
