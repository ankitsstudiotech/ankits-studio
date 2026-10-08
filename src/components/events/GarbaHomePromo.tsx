import Image from "next/image";
import Link from "next/link";
import { getActiveSeasonalPromos } from "@/content";
import { getGarbaMediaAvailability } from "@/content/events/media-availability";
import { EventBookingCTA } from "./EventBookingCTA";
import styles from "./garba-night.module.css";

/**
 * Homepage seasonal campaign billboard — content-driven left stack beside poster.
 *
 * Desktop whitespace root cause (polish-02): poster previously spanned two grid
 * rows with aspect-ratio height, stretching `auto` row 1 so Lead sat at the top
 * of that tall track and Convert began in row 2 — leaving a giant empty band
 * between "5TH EDITION" and the event facts. Fix: one left content column
 * (natural height) + poster beside it.
 */
export function GarbaHomePromo() {
  const [event] = getActiveSeasonalPromos();
  if (!event) return null;

  const media = getGarbaMediaAvailability();

  return (
    <aside
      className={styles.homeBillboard}
      aria-labelledby="garba-home-promo-title"
      data-campaign="garba-night-2026"
    >
      <div className={styles.homeBillboardInner}>
        <div className={styles.homeBillboardCopy}>
          <p className={styles.homeBillboardKicker}>{event.presenterLine}</p>
          <p id="garba-home-promo-title" className={styles.homeBillboardTitle}>
            Garba Night
          </p>
          <p className={styles.homeBillboardEdition}>{event.editionLabel}</p>

          <p className={styles.homeBillboardDateAnchor}>17 Oct</p>
          <p className={styles.homeBillboardSupport}>
            7 PM – Midnight
            <span aria-hidden="true"> · </span>
            Airoli
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

          <div className={styles.homeBillboardActions}>
            <Link href={event.path} className={styles.homeBillboardSecondary}>
              View event
            </Link>
            <EventBookingCTA
              source="homepage-billboard"
              className={styles.homeBillboardPrimary}
            />
          </div>
        </div>

        {media.poster ? (
          <div className={styles.homeBillboardPoster}>
            <Image
              src={event.media.poster}
              alt={event.media.posterAlt}
              width={1024}
              height={1536}
              sizes="(max-width: 899px) 100vw, 42vw"
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
