import type { Branch } from "@/content";
import { getBranchMapsUrl } from "@/content";
import { PulseMedia } from "@/components/media";
import { BranchRow } from "@/components/locations/BranchRow";
import { HeroReveal } from "@/components/motion";
import { resolveSlotMedia } from "@/content/media";
import { LocationPulseCta } from "./LocationPulseMotion";
import styles from "./location-pulse.module.css";

export type LocationDiscoveryProps = {
  branches: Branch[];
  trialHref: string;
  trialLabel: string;
};

/**
 * Place-first branch index — numbered editorial rows.
 * Optional generic `locations.atmosphere` only when synthetic preview resolves.
 */
export function LocationDiscovery({ branches, trialHref, trialLabel }: LocationDiscoveryProps) {
  const atmosphere = resolveSlotMedia("locations.atmosphere");

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

      {atmosphere ? (
        <div className={styles.atmosphereMedia}>
          <PulseMedia item={atmosphere} sizes="100vw" />
        </div>
      ) : null}

      <ol className={styles.branchIndexList}>
        {branches.map((branch, index) => {
          const mapsUrl = getBranchMapsUrl(branch);
          const addressLine = branch.address
            ? branch.address.replace(/,\s*Maharashtra\s+\d{6}$/i, "")
            : null;
          const num = String(index + 1).padStart(2, "0");

          return (
            <li key={branch.slug} className={styles.branchIndexItem}>
              <span className={styles.branchIndexNum} aria-hidden>
                {num}
              </span>
              <div className={styles.branchIndexBody}>
                <BranchRow
                  name={branch.locality}
                  href={`/locations/${branch.slug}`}
                  address={addressLine}
                  mapsUrl={mapsUrl}
                  pending={!mapsUrl}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className={styles.ctaRow}>
        <LocationPulseCta href={trialHref}>{trialLabel}</LocationPulseCta>
      </div>
    </section>
  );
}
