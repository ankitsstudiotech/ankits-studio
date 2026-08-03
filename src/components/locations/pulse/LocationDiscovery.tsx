import Link from "next/link";
import type { Branch } from "@/content";
import { getBranchMapsUrl } from "@/content";
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
        Ankit’s Studio branches in Airoli, Ghansoli, and Thane. Check current batch times on
        WhatsApp — schedules are not published as fixed rows yet. A free trial is available.
      </p>

      <ul className={styles.placeList}>
        {branches.map((branch) => {
          const mapsUrl = getBranchMapsUrl(branch);
          const addressPending = branch.address == null;
          const mapsPending = mapsUrl == null;
          const addressLine = branch.address
            ? branch.address.replace(/,\s*Maharashtra\s+\d{6}$/i, "")
            : null;

          return (
            <li key={branch.slug} className={styles.placeRow}>
              <div>
                <h2 className={styles.placeName}>
                  <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
                </h2>
                {addressLine ? <p className={styles.placeStatus}>{addressLine}</p> : null}
                {addressPending || mapsPending ? (
                  <p className={styles.placeStatus}>
                    {addressPending && mapsPending
                      ? "Address & map updating"
                      : addressPending
                        ? "Detailed address updating"
                        : "Map available"}
                  </p>
                ) : null}
              </div>
              <p className={styles.placeMeta}>
                {mapsPending && addressPending
                  ? "Open branch. Detailed address and map are being updated — message WhatsApp for directions."
                  : addressPending
                    ? "Open branch. Detailed address is being updated. Use Maps for directions when linked."
                    : "Open branch — printable address, Maps link, and WhatsApp trial enquiry."}
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
                  <span className={styles.actionMuted}>Maps link pending</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.ctaRow}>
        <LocationPulseCta href={trialHref}>{trialLabel}</LocationPulseCta>
        <p className={styles.ctaNote}>
          Prefer WhatsApp for current batch availability. Opening chat does not mean your enquiry
          was submitted.
        </p>
      </div>
    </section>
  );
}
