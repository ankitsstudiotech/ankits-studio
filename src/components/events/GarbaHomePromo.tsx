import Image from "next/image";
import Link from "next/link";
import { getActiveSeasonalPromos } from "@/content";
import { getGarbaMediaAvailability } from "@/content/events/media-availability";
import { EventBookingCTA } from "./EventBookingCTA";
import styles from "./garba-night.module.css";

/**
 * Homepage Garba campaign surface.
 *
 * When `HOME_SEASONAL_CAMPAIGN === "garba-night-2026"` this is the page hero
 * (H1, first content after header/ribbon). Restore by setting that constant
 * to `null` (ADR-026) — do not leave a second billboard lower on Home.
 */
export function GarbaHomePromo() {
  const [event] = getActiveSeasonalPromos();
  if (!event) return null;

  const media = getGarbaMediaAvailability();

  return (
    <section
      className={styles.homeBillboard}
      aria-labelledby="garba-home-hero-title"
      data-campaign="garba-night-2026"
      data-home-surface="hero"
    >
      <div className={styles.homeBillboardInner}>
        <div className={styles.homeBillboardCopy}>
          <p className={styles.homeBillboardKicker}>{event.presenterLine}</p>
          <h1 id="garba-home-hero-title" className={styles.homeBillboardTitle}>
            Garba Night
          </h1>
          <p className={styles.homeBillboardEdition}>{event.editionLabel}</p>

          <p className={styles.homeBillboardDateAnchor}>17 Oct</p>
          <p className={styles.homeBillboardSupport}>
            <span>{event.dayLabel}</span>
            <span aria-hidden="true"> · </span>
            <span>7 PM – Midnight</span>
            <span aria-hidden="true"> · </span>
            <span>Airoli</span>
          </p>

          <div className={styles.homeBillboardPriceRow} aria-label="Pass prices">
            <div className={styles.homeBillboardPriceBlock}>
              <span className={styles.homeBillboardPriceLabel}>Members</span>
              <span className={styles.homeBillboardPriceValue}>
                {event.memberPriceLabel}
              </span>
            </div>
            <div className={styles.homeBillboardPriceBlock}>
              <span className={styles.homeBillboardPriceLabel}>Guests</span>
              <span className={styles.homeBillboardPriceValue}>
                {event.guestPriceLabel}
              </span>
            </div>
          </div>

          <ul className={styles.homeBillboardMeta}>
            <li>{event.audienceLabel}</li>
            <li>{event.capacityLabel}</li>
          </ul>

          <div className={styles.homeBillboardActions}>
            <EventBookingCTA
              source="homepage-hero"
              className={styles.homeBillboardPrimary}
            />
            <Link href={event.path} className={styles.homeBillboardSecondary}>
              View event details
            </Link>
          </div>
          <p className={styles.homeBillboardBookingNote}>
            Booking handled by Kaizen Events
          </p>
        </div>

        {media.poster ? (
          <div className={styles.homeBillboardPoster}>
            <Image
              src={event.media.poster}
              alt={event.media.posterAlt}
              width={1024}
              height={1536}
              sizes="(max-width: 899px) 100vw, 42vw"
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
