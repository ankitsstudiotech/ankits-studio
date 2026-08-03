import type { Branch } from "@/content";
import { getBranchMapsUrl } from "@/content";
import { BranchRow } from "@/components/locations/BranchRow";
import { HeroReveal } from "@/components/motion";
import { WHATSAPP_REVIEW_HELPER } from "@/lib/conversion";
import { LocationPulseCta } from "./LocationPulseMotion";
import styles from "./location-pulse.module.css";

export type LocationDiscoveryProps = {
  branches: Branch[];
  trialHref: string;
  trialLabel: string;
};

/**
 * Place-first branch index — locality names lead via BranchRow.
 * Unique lede at page level only; one WhatsApp CTA.
 */
export function LocationDiscovery({ branches, trialHref, trialLabel }: LocationDiscoveryProps) {
  return (
    <section className={`${styles.field} ${styles.band}`} aria-labelledby="locations-index-title">
      <HeroReveal>
        <h1 id="locations-index-title" className={styles.bandTitle}>
          Four neighbourhood studios
        </h1>
        <p className={styles.bandLede}>
          Ankit’s Studio branches in Airoli, Ghansoli, and Thane. Message WhatsApp for current batch
          times. A free trial is available.
        </p>
      </HeroReveal>

      <ul className={styles.branchRows}>
        {branches.map((branch) => {
          const mapsUrl = getBranchMapsUrl(branch);
          const addressLine = branch.address
            ? branch.address.replace(/,\s*Maharashtra\s+\d{6}$/i, "")
            : null;

          return (
            <li key={branch.slug}>
              <BranchRow
                name={branch.locality}
                href={`/locations/${branch.slug}`}
                address={addressLine}
                mapsUrl={mapsUrl}
                pending={!mapsUrl}
              />
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
