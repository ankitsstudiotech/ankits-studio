import Image from "next/image";
import Link from "next/link";
import { FaqBlock } from "@/components/content/FaqBlock";
import { ClosingBand } from "@/components/conversion/ClosingBand";
import { RouteOpening, SectionReveal } from "@/components/motion";
import type { GarbaMediaAvailability, GarbaNight2026 } from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { GarbaWhatsAppSupportLink } from "./GarbaWhatsAppSupportLink";
import { EventBookingCTA } from "./EventBookingCTA";
import { EventDirectionsLink } from "./EventDirectionsLink";
import { EventVideo } from "./EventVideo";
import { GarbaCampaignMedia } from "./GarbaCampaignMedia";
import { GarbaHighlightsGallery } from "./GarbaHighlightsGallery";
import { GarbaStickyReserve } from "./GarbaStickyReserve";
import styles from "./garba-night.module.css";

export type GarbaNightViewProps = {
  event: GarbaNight2026;
  media: GarbaMediaAvailability;
};

function highlightById(event: GarbaNight2026, id: string) {
  return event.highlights.find((item) => item.id === id);
}

function NightAttractions({ event }: { event: GarbaNight2026 }) {
  const liveDj = highlightById(event, "live-dj");
  const prizes = highlightById(event, "prizes");
  const garbaStreet = highlightById(event, "garba-street");
  const photoZones = highlightById(event, "photo-zones");
  const refreshments = highlightById(event, "refreshments");

  return (
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
  );
}

function VenueSection({
  event,
  fullAddress,
}: {
  event: GarbaNight2026;
  fullAddress: string;
}) {
  return (
    <section
      className={`${styles.band} ${styles.venueBand}`}
      aria-labelledby="garba-venue-title"
    >
      <div className={`${styles.wrap} ${styles.venueGrid}`}>
        <div className={styles.venueCopy}>
          <h2 id="garba-venue-title" className={styles.sectionTitle}>
            Venue
          </h2>
          <p className={styles.venueName}>{event.venueName}</p>
          <p className={styles.venueAddress}>{fullAddress}</p>
          <div className={styles.actions}>
            <EventDirectionsLink className={styles.primaryCta} />
          </div>
        </div>
        <div className={styles.venueDestination} aria-hidden="true">
          <p className={styles.venueDestinationPlace}>Airoli</p>
          <p className={styles.venueDestinationSchool}>VIBGYOR High School</p>
          <p className={styles.venueDestinationMeta}>
            17 Oct · 7 PM – Midnight
          </p>
        </div>
      </div>
    </section>
  );
}

function PassPricingSection({
  event,
  concluded,
}: {
  event: GarbaNight2026;
  concluded: boolean;
}) {
  return (
    <section
      className={`${styles.band} ${styles.passesBand}`}
      aria-labelledby="garba-pricing-title"
    >
      <div className={`${styles.wrap} ${styles.passesWrap}`}>
        <h2 id="garba-pricing-title" className={styles.passesTitle}>
          {concluded ? "Pass Pricing — 5th Edition" : "Passes"}
        </h2>
        <div className={styles.passesGrid}>
          {event.passProducts.map((pass) => (
            <div key={pass.id} className={styles.passesPrice}>
              <p className={styles.passesLabel}>{pass.name}</p>
              <p className={styles.passesAmount}>
                {pass.priceLabel}
                <span className={styles.passesUnit}> {pass.unitLabel}</span>
              </p>
              <p className={styles.passesAge}>{pass.qualifierLabel}</p>
            </div>
          ))}
        </div>
        {!concluded ? (
          <div className={styles.passesActionRow}>
            <EventBookingCTA source="event-passes" className={styles.primaryCta} />
          </div>
        ) : null}
        <p className={styles.refreshmentsNote}>{event.refreshmentsNote}</p>
        {!concluded ? (
          <p className={styles.registrationFeeNote}>
            Final payable amount is shown during registration on Kaizen Events.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function GarbaNightView({ event, media }: GarbaNightViewProps) {
  const concluded = event.lifecycle === "concluded";
  const current = event.media.currentEdition;
  const fullAddress = [
    event.venueName,
    event.streetAddress,
    event.addressLocality,
    `${event.addressRegion} ${event.postalCode}`,
    "India",
  ].join("\n");
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

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
                <div className={styles.archiveStatus}>
                  <p className={styles.archiveBanner}>
                    Event concluded · 17 October 2026
                  </p>
                  <p className={styles.archiveLede}>
                    Relive Ankit&apos;s Studio Garba Night — 5th Edition through
                    highlights from 17 October 2026 in Airoli.
                  </p>
                </div>
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
              {concluded && media.currentEditionHero ? (
                <div className={styles.archiveHeroMedia}>
                  <Image
                    src={current.hero}
                    alt={current.heroAlt}
                    width={current.heroWidth}
                    height={current.heroHeight}
                    sizes="(max-width: 959px) 100vw, 42vw"
                    priority
                    className={styles.archiveHeroImage}
                  />
                </div>
              ) : media.poster ? (
                <>
                  <GarbaCampaignMedia
                    posterSrc={event.media.poster}
                    posterAlt={event.media.posterAlt}
                    teaserSrc={
                      media.promoTeaser ? event.media.promoTeaser.src : undefined
                    }
                    teaserPoster={
                      media.promoTeaser
                        ? event.media.promoTeaser.poster
                        : undefined
                    }
                    teaserLabel={event.media.promoTeaser.label}
                  />
                  <p className={styles.posterPricingNote}>
                    {event.pricingArtworkNote}
                  </p>
                </>
              ) : null}
            </div>

            <div className={styles.heroConvert}>
              <div className={styles.priceRow}>
                <div className={styles.priceCell}>
                  <p className={styles.priceLabel}>Members</p>
                  <p className={styles.priceValue}>
                    <span className="sr-only">Ankit&apos;s Studio members </span>
                    {event.memberPriceLabel}
                    <span className="sr-only"> per pass</span>
                  </p>
                  <p className={styles.priceAge}>{event.memberAgeLabel}</p>
                </div>
                <div className={styles.priceCell}>
                  <p className={styles.priceLabel}>Guests</p>
                  <p className={styles.priceValue}>
                    <span className="sr-only">Guests </span>
                    {event.guestPriceLabel}
                    <span className="sr-only"> per pass</span>
                  </p>
                  <p className={styles.priceAge}>{event.guestAgeLabel}</p>
                </div>
              </div>
              <p className={styles.heroSecondaryPricing}>
                {concluded
                  ? "Kids & group pass pricing below"
                  : "Kids & group passes available"}
              </p>

              <ul className={styles.facts}>
                <li>{event.capacityLabel}</li>
              </ul>

              <div className={styles.actions}>
                {!concluded ? (
                  <EventBookingCTA
                    source="event-hero"
                    className={styles.primaryCta}
                  />
                ) : null}
                <EventDirectionsLink
                  className={
                    concluded ? styles.primaryCta : styles.secondaryCta
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </RouteOpening>

      {concluded && media.currentEditionHighlights ? (
        <section
          className={`${styles.band} ${styles.currentHighlightsBand}`}
          aria-labelledby="garba-2026-highlights-title"
          data-edition="2026"
        >
          <div className={styles.wrap}>
            <SectionReveal>
              <p className={styles.sectionEyebrow}>2026 Highlights</p>
              <h2
                id="garba-2026-highlights-title"
                className={styles.sectionTitle}
              >
                The 5th Edition in motion
              </h2>
              <p className={styles.sectionLede}>
                {current.highlightsVideo.caption}
              </p>
            </SectionReveal>
            <EventVideo
              className={styles.currentHighlightsVideo}
              src={current.highlightsVideo.src}
              poster={current.highlightsVideo.poster}
              label={current.highlightsVideo.label}
              playEvent="garba_2026_highlights_video_play"
              mode="manual"
              lazy
            />
            <GarbaHighlightsGallery images={current.gallery} />
          </div>
        </section>
      ) : null}

      {!concluded ? <PassPricingSection event={event} concluded={false} /> : null}

      <NightAttractions event={event} />

      <VenueSection event={event} fullAddress={fullAddress} />

      {concluded ? <PassPricingSection event={event} concluded /> : null}

      {concluded && media.poster ? (
        <section
          className={`${styles.band} ${styles.historicalPosterBand}`}
          aria-labelledby="garba-poster-title"
        >
          <div className={styles.wrap}>
            <SectionReveal>
              <h2 id="garba-poster-title" className={styles.sectionTitle}>
                5th Edition event poster
              </h2>
              <p className={styles.sectionLede}>
                The campaign poster used ahead of Garba Night — 5th Edition.
              </p>
            </SectionReveal>
            <div className={styles.historicalPosterFrame}>
              <Image
                src={event.media.poster}
                alt={event.media.posterAlt}
                width={1024}
                height={1536}
                sizes="(max-width: 767px) 100vw, 28rem"
                className={styles.historicalPosterImage}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      ) : null}

      {media.previousEdition ? (
        <section
          id="garba-previous"
          className={`${styles.band} ${styles.previousBand}`}
          aria-labelledby="garba-previous-title"
        >
          <div className={styles.wrap}>
            <SectionReveal>
              <p className={styles.sectionEyebrow}>Previous Edition</p>
              <h2 id="garba-previous-title" className={styles.sectionTitle}>
                From the previous edition
              </h2>
              <p className={styles.previousEditionLabel}>Garba Night 4.0</p>
              <p className={styles.sectionLede}>
                {event.media.previousEdition.caption}
              </p>
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
          {!concluded ? (
            <p className={styles.supportLine}>
              <GarbaWhatsAppSupportLink className={styles.supportLink} />
            </p>
          ) : null}
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
              Book your pass
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
            <p className={styles.closingSecondaryPricing}>
              {event.secondaryPricingLine}
            </p>
            <EventBookingCTA
              source="event-closing"
              className={styles.closingCta}
            />
          </div>
        </section>
      ) : (
        <ClosingBand
          titleId="garba-closing-title"
          title="Keep training with Ankit's Studio"
          body="Garba Night — 5th Edition has concluded. Explore programmes across our Navi Mumbai studios, or book a free trial class."
          variant="field"
          secondary={
            <Link href="/programs" className={styles.archiveSecondaryCta}>
              Explore programmes
            </Link>
          }
        >
          <a href={trialHref} className={styles.archivePrimaryCta}>
            {trialLabel}
          </a>
        </ClosingBand>
      )}

      {!concluded ? <GarbaStickyReserve /> : null}
    </div>
  );
}
