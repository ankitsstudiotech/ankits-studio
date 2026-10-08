import Image from "next/image";
import Link from "next/link";
import { getActiveSeasonalPromos } from "@/content";
import { getGarbaMediaAvailability } from "@/content/events/media-availability";
import { EventBookingCTA } from "./EventBookingCTA";
import styles from "./garba-night.module.css";

/**
 * Homepage seasonal campaign billboard — interrupts normal homepage rhythm
 * immediately after the main hero. Poster only (no teaser video on Home).
 *
 * Mobile order: eyebrow → title → edition → poster → facts → prices → CTAs
 * Desktop: ~7/5 copy | poster
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
        <div className={styles.homeBillboardLead}>
          <p className={styles.homeBillboardKicker}>{event.presenterLine}</p>
          <p id="garba-home-promo-title" className={styles.homeBillboardTitle}>
            Garba Night
          </p>
          <p className={styles.homeBillboardEdition}>{event.editionLabel}</p>
        </div>

        {media.poster ? (
          <div className={styles.homeBillboardPoster}>
            <Image
              src={event.media.poster}
              alt={event.media.posterAlt}
              width={1024}
              height={1536}
              sizes="(max-width: 899px) 100vw, 40vw"
            />
          </div>
        ) : null}

        <div className={styles.homeBillboardConvert}>
          <dl className={styles.homeBillboardMeta}>
            <div>
              <dt className="sr-only">Date</dt>
              <dd>17 Oct</dd>
            </div>
            <div>
              <dt className="sr-only">Time</dt>
              <dd>7 PM – Midnight</dd>
            </div>
            <div>
              <dt className="sr-only">Venue</dt>
              <dd>Airoli</dd>
            </div>
          </dl>

          <p className={styles.homeBillboardPrices}>
            <span>
              <span className={styles.homeBillboardPriceLabel}>Members </span>
              {event.memberPriceLabel}
            </span>
            <span aria-hidden="true"> · </span>
            <span>
              <span className={styles.homeBillboardPriceLabel}>Guests </span>
              {event.guestPriceLabel}
            </span>
          </p>

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
      </div>
    </aside>
  );
}
