import { FaqBlock } from "@/components/content/FaqBlock";
import { RouteOpening, SectionReveal } from "@/components/motion";
import type { GarbaMediaAvailability, GarbaNight2026 } from "@/content";
import { EventBookingCTA } from "./EventBookingCTA";
import { EventDirectionsLink } from "./EventDirectionsLink";
import { EventVideo } from "./EventVideo";
import { GarbaCampaignMedia } from "./GarbaCampaignMedia";
import { GarbaStickyReserve } from "./GarbaStickyReserve";
import styles from "./garba-night.module.css";

export type GarbaNightViewProps = {
  event: GarbaNight2026;
  media: GarbaMediaAvailability;
};

function highlightById(event: GarbaNight2026, id: string) {
  return event.highlights.find((item) => item.id === id);
}

export function GarbaNightView({ event, media }: GarbaNightViewProps) {
  const concluded = event.lifecycle === "concluded";
  const fullAddress = [
    event.venueName,
    event.streetAddress,
    event.addressLocality,
    `${event.addressRegion} ${event.postalCode}`,
    "India",
  ].join("\n");

  const liveDj = highlightById(event, "live-dj");
  const prizes = highlightById(event, "prizes");
  const garbaStreet = highlightById(event, "garba-street");
  const photoZones = highlightById(event, "photo-zones");
  const refreshments = highlightById(event, "refreshments");

  return (
    <div
      className={`${styles.page} ${concluded ? "" : styles.pageWithSticky}`}
      data-event={event.slug}
      data-lifecycle={event.lifecycle}
    >
      <RouteOpening>
        <section className={`${styles.band} ${styles.hero}`} aria-labelledby="garba-title">
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div className={styles.heroIntro}>
              {concluded ? (
                <p className={styles.archiveBanner}>Garba Night 2026 has concluded</p>
              ) : null}
              <p className={styles.kicker}>{event.presenterLine}</p>
              <div className={styles.titleBlock}>
                <h1 id="garba-title" className={styles.title}>
                  Garba Night
                  <span className={styles.edition}>{event.editionLabel}</span>
                </h1>
              </div>

              <dl className={styles.metaGrid}>
                <div className={styles.metaCell}>
                  <dt className={styles.metaLabel}>Date</dt>
                  <dd className={styles.metaValue}>
                    {event.dayLabel}
                    <br />
                    {event.dateLabel}
                  </dd>
                </div>
                <div className={styles.metaCell}>
                  <dt className={styles.metaLabel}>Time</dt>
                  <dd className={styles.metaValue}>{event.timeLabel}</dd>
                </div>
                <div className={styles.metaCell}>
                  <dt className={styles.metaLabel}>Venue</dt>
                  <dd className={styles.metaValue}>
                    VIBGYOR High School
                    <br />
                    {event.venueLocality}
                  </dd>
                </div>
                <div className={styles.metaCell}>
                  <dt className={styles.metaLabel}>Capacity</dt>
                  <dd className={styles.metaValue}>{event.capacityLabel}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.heroMedia}>
              {media.poster ? (
                <GarbaCampaignMedia
                  posterSrc={event.media.poster}
                  posterAlt={event.media.posterAlt}
                  teaserSrc={media.promoTeaser ? event.media.promoTeaser.src : undefined}
                  teaserPoster={
                    media.promoTeaser ? event.media.promoTeaser.poster : undefined
                  }
                  teaserLabel={event.media.promoTeaser.label}
                />
              ) : null}
            </div>

            <div className={styles.heroConvert}>
              <div className={styles.priceRow}>
                <div className={styles.priceCell}>
                  <p className={styles.priceLabel}>Members</p>
                  <p className={styles.priceValue}>
                    <span className="sr-only">Ankit&apos;s Studio members </span>
                    {event.memberPriceLabel}
                    <span className="sr-only"> per person</span>
                  </p>
                </div>
                <div className={styles.priceCell}>
                  <p className={styles.priceLabel}>Guests</p>
                  <p className={styles.priceValue}>
                    <span className="sr-only">Guests </span>
                    {event.guestPriceLabel}
                    <span className="sr-only"> per person</span>
                  </p>
                </div>
              </div>

              <ul className={styles.facts}>
                <li>{event.audienceLabel}</li>
                <li>{event.capacityLabel}</li>
              </ul>

              {!concluded ? (
                <div className={styles.actions}>
                  <EventBookingCTA source="hero" className={styles.primaryCta} />
                  <EventDirectionsLink className={styles.secondaryCta} />
                </div>
              ) : (
                <div className={styles.actions}>
                  <EventBookingCTA source="hero" className={styles.primaryCta} />
                </div>
              )}
            </div>
          </div>
        </section>
      </RouteOpening>

      <section className={styles.band} aria-labelledby="garba-pricing-title">
        <div className={styles.wrap}>
          <SectionReveal>
            <h2 id="garba-pricing-title" className={styles.sectionTitle}>
              Passes
            </h2>
            <p className={styles.sectionLede}>
              Reserve your place for Garba Night — 5th Edition. Refreshments are sold
              separately at the venue.
            </p>
          </SectionReveal>
          <div className={styles.pricingGrid}>
            <article className={styles.pricingCard}>
              <h3>Ankit&apos;s Studio Members</h3>
              <p className={styles.pricingAmount}>{event.memberPriceLabel}</p>
              <p className={styles.pricingNote}>Per person</p>
            </article>
            <article className={styles.pricingCard}>
              <h3>Guests</h3>
              <p className={styles.pricingAmount}>{event.guestPriceLabel}</p>
              <p className={styles.pricingNote}>Per person</p>
            </article>
          </div>
          {!concluded ? (
            <div className={styles.pricingActions}>
              <EventBookingCTA source="pricing" className={styles.primaryCta} />
            </div>
          ) : null}
          <p className={styles.refreshmentsNote}>{event.refreshmentsNote}</p>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="garba-highlights-title">
        <div className={styles.wrap}>
          <SectionReveal>
            <h2 id="garba-highlights-title" className={styles.sectionTitle}>
              The Night
            </h2>
            <p className={styles.sectionLede}>
              Confirmed attractions for Garba Night — 5th Edition.
            </p>
          </SectionReveal>

          <div className={styles.nightGrid}>
            {liveDj ? (
              <article className={`${styles.nightModule} ${styles.nightLive}`}>
                <h3>{liveDj.title}</h3>
                <p>{liveDj.body}</p>
              </article>
            ) : null}

            {prizes ? (
              <article className={`${styles.nightModule} ${styles.nightPrizes}`}>
                <h3>{prizes.title}</h3>
                <p>{prizes.body}</p>
                <ul className={styles.moduleChips} aria-label="Prize categories">
                  {event.prizeCategories.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            {garbaStreet ? (
              <article className={`${styles.nightModule} ${styles.nightStreet}`}>
                <h3>{garbaStreet.title}</h3>
                <p>{garbaStreet.body}</p>
                <ul className={styles.moduleChips} aria-label="Garba Street stalls">
                  {event.stallKinds.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            <div className={styles.nightStack}>
              {photoZones ? (
                <article className={styles.nightModule}>
                  <h3>{photoZones.title}</h3>
                  <p>{photoZones.body}</p>
                </article>
              ) : null}
              {refreshments ? (
                <article className={styles.nightModule}>
                  <h3>{refreshments.title}</h3>
                  <p>{refreshments.body}</p>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {media.previousEdition ? (
        <section
          className={`${styles.band} ${styles.previousBand}`}
          aria-labelledby="garba-previous-title"
        >
          <div className={styles.wrap}>
            <SectionReveal>
              <h2 id="garba-previous-title" className={styles.sectionTitle}>
                From the previous edition
              </h2>
              <p className={styles.previousEditionLabel}>Garba Night 4.0</p>
              <p className={styles.sectionLede}>{event.media.previousEdition.caption}</p>
            </SectionReveal>
            <EventVideo
              className={styles.previousVideoShell}
              src={event.media.previousEdition.src}
              poster={event.media.previousEdition.poster}
              label={event.media.previousEdition.label}
              playEvent="garba_previous_event_video_play"
              mode="manual"
              lazy
            />
          </div>
        </section>
      ) : null}

      <section className={styles.band} aria-labelledby="garba-venue-title">
        <div className={styles.wrap}>
          <SectionReveal>
            <h2 id="garba-venue-title" className={styles.sectionTitle}>
              Venue
            </h2>
            <p className={styles.sectionLede}>{event.venueName}</p>
          </SectionReveal>
          <p className={styles.venueAddress}>{fullAddress}</p>
          <div className={styles.actions}>
            <EventDirectionsLink className={styles.primaryCta} />
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="garba-faq-title">
        <div className={styles.wrap}>
          <FaqBlock
            titleId="garba-faq-title"
            heading="FAQ"
            items={event.faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
            }))}
          />
        </div>
      </section>

      {!concluded ? (
        <section
          className={styles.closingCampaign}
          aria-labelledby="garba-closing-title"
        >
          <div className={styles.closingCampaignInner}>
            <p className={styles.closingCapacity}>{event.capacityLabel}</p>
            <h2 id="garba-closing-title" className={styles.closingTitle}>
              Reserve your pass
            </h2>
            <p className={styles.closingMeta}>
              17 October 2026
              <span aria-hidden="true"> · </span>
              VIBGYOR High School, Airoli
            </p>
            <p className={styles.closingPrices}>
              <span>
                Members <strong>{event.memberPriceLabel}</strong>
              </span>
              <span aria-hidden="true"> · </span>
              <span>
                Guests <strong>{event.guestPriceLabel}</strong>
              </span>
            </p>
            <EventBookingCTA source="closing-cta" className={styles.closingCta} />
          </div>
        </section>
      ) : (
        <section
          className={styles.closingCampaign}
          aria-labelledby="garba-closing-title"
          data-concluded="true"
        >
          <div className={styles.closingCampaignInner}>
            <h2 id="garba-closing-title" className={styles.closingTitle}>
              Thanks for celebrating with us
            </h2>
            <p className={styles.closingMeta}>
              Garba Night 2026 has concluded. Follow Ankit&apos;s Studio for future
              community nights and studio programmes.
            </p>
            <EventBookingCTA source="closing-cta" className={styles.closingCta} />
          </div>
        </section>
      )}

      {!concluded ? <GarbaStickyReserve /> : null}
    </div>
  );
}
