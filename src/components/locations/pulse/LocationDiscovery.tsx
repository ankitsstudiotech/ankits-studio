import Link from "next/link";
import type { Branch } from "@/content";
import { getBranchMapsUrl } from "@/content";
import { PulseMedia } from "@/components/media";
import { HeroReveal } from "@/components/motion";
import { resolveSlotMedia } from "@/content/media";
import { LocationPulseCta } from "./LocationPulseMotion";
import styles from "./location-pulse.module.css";

export type LocationDiscoveryProps = {
  branches: Branch[];
  trialHref: string;
  trialLabel: string;
};

const DEFAULT_HOURS = "Open daily · 6:00 AM–10:00 PM";

/**
 * Place-first studio directory — four vertical zones on desktop.
 * Atmosphere media stays a separate illustrative chapter, never branch documentary.
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

      <ol className={styles.studioDirectory}>
        {branches.map((branch, index) => {
          const mapsUrl = getBranchMapsUrl(branch);
          const addressLine = branch.address
            ? branch.address.replace(/,\s*Maharashtra\s+\d{6}$/i, "")
            : null;
          const num = String(index + 1).padStart(2, "0");
          const hours =
            branch.openingHours[0] != null
              ? `${formatClock(branch.openingHours[0].opensAt)}–${formatClock(branch.openingHours[0].closesAt)} daily`
              : DEFAULT_HOURS;

          return (
            <li key={branch.slug} className={styles.studioColumn}>
              <span className={styles.studioNum} aria-hidden>
                {num}
              </span>
              <h2 className={styles.studioName}>
                <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
              </h2>
              {addressLine ? <p className={styles.studioAddress}>{addressLine}</p> : null}
              {branch.landmarks ? <p className={styles.studioLandmark}>{branch.landmarks}</p> : null}
              <p className={styles.studioHours}>{hours}</p>
              <div className={styles.studioActions}>
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    className={styles.studioAction}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                ) : (
                  <span className={styles.actionMuted}>Maps updating</span>
                )}
                <Link href={`/locations/${branch.slug}`} className={styles.studioAction}>
                  Studio page
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      {atmosphere ? (
        <div className={styles.atmosphereMedia}>
          <PulseMedia item={atmosphere} sizes="100vw" />
          <p className={styles.atmosphereNote}>
            Illustrative studio atmosphere — not a photograph of a specific branch.
          </p>
        </div>
      ) : null}

      <div className={styles.ctaRow}>
        <LocationPulseCta href={trialHref}>{trialLabel}</LocationPulseCta>
      </div>
    </section>
  );
}

function formatClock(value: string): string {
  const [hRaw, mRaw] = value.split(":");
  const h = Number(hRaw);
  const m = mRaw ?? "00";
  if (!Number.isFinite(h)) return value;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${suffix}`;
}
