import Link from "next/link";
import type { Programme, ProgrammeSlug } from "@/content";
import { HeroReveal, SectionReveal } from "@/components/motion";
import { ProgrammePulseCta, type ProgrammeTempo } from "./ProgrammePulseMotion";
import styles from "./programme-pulse.module.css";

const SLUG_TEMPO: Record<string, ProgrammeTempo> = {
  "functional-training": "functional",
  yoga: "yoga",
  zumba: "zumba",
  "adult-dance": "dance",
  "wedding-choreography": "wedding",
  "home-personal-training": "home",
  "online-training": "online",
};

function benefitsNote(programme: Programme): string {
  switch (programme.slug) {
    case "functional-training":
      return "Not every piece of equipment appears in every session.";
    case "yoga":
      return "Session focus varies by batch — ask which option suits you.";
    case "zumba":
    case "adult-dance":
      return "Music and session focus vary by batch.";
    case "wedding-choreography":
      return "Routines are arranged around your event needs.";
    case "home-personal-training":
      return "Sessions are planned around your space and goals.";
    case "online-training":
      return "Format and timing are agreed when you enquire.";
    default:
      return "Session details vary — ask what to expect when you enquire.";
  }
}

export type ProgrammeDetailViewProps = {
  programme: Programme;
  locations: Array<{ slug: string; name: string; href: string }>;
  related: Array<{ slug: ProgrammeSlug; name: string }>;
  whatsappHref: string;
  whatsappLabel: string;
};

function deliveryLabel(programme: Programme): string {
  if (programme.deliveryMode === "home") {
    return "Training is delivered at your location.";
  }
  if (programme.deliveryMode === "online") {
    return "Remote sessions via Zoom (one-to-one and group).";
  }
  return "Studio sessions at listed branches.";
}

function formatLabel(programme: Programme): string {
  if (programme.deliveryMode === "home") {
    return "Coach-led personal training at your location — priced per session.";
  }
  if (programme.deliveryMode === "online") {
    return "Coach-led sessions on Zoom — one-to-one and group formats.";
  }
  return programme.classStructure;
}

function hoursNote(programme: Programme): string {
  if (programme.deliveryMode === "home" || programme.deliveryMode === "online") {
    return "Session times arranged on enquiry.";
  }
  return "Studios open 6:00 AM–10:00 PM every day.";
}

/**
 * Programme detail — customer language, Pulse editorial structure.
 * Tempo personality via data-tempo only (padding/cue), not typography forks.
 */
export function ProgrammeDetailView({
  programme,
  locations,
  related,
  whatsappHref,
  whatsappLabel,
}: ProgrammeDetailViewProps) {
  const tempo = SLUG_TEMPO[programme.slug] ?? "functional";
  const batchLabel =
    programme.batchScheduleStatus === "published"
      ? "See batch availability"
      : "Message us for current batch times. Studios open 6:00 AM–10:00 PM every day.";

  const clusterKicker =
    programme.serviceCluster === "train"
      ? "Train"
      : programme.serviceCluster === "move"
        ? "Move"
        : programme.serviceCluster === "celebrate"
          ? "Celebrate"
          : "Programme";

  const trialText = programme.trialAvailable
    ? "Free trial available — enquire on WhatsApp"
    : "Ask about a trial when you enquire";

  const pricingText =
    programme.pricingStatus === "published"
      ? "See pricing page"
      : "Message us for the current programme fee · ₹300 one-time registration after you join";

  const audienceParts: string[] = [];
  if (programme.ladiesOnlyBatchesAvailable) {
    audienceParts.push("Ladies-only batches available on request");
  }
  if (programme.kidsOnlyBatchesAvailable) {
    audienceParts.push("Kids-only batches available on request");
  }

  const showLocations =
    locations.length > 0 && programme.deliveryMode === "in-studio";
  const showRelated = related.length > 0;

  return (
    <div className={styles.field}>
      <section
        className={styles.detailHero}
        data-tempo={tempo}
        aria-labelledby="programme-title"
      >
        <HeroReveal>
          <p className={styles.detailKicker}>{clusterKicker}</p>
          <h1 id="programme-title">{programme.name}</h1>
          <p className={styles.detailLede}>{programme.shortDescription}</p>
          <div className={styles.ctaRow}>
            <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
          </div>
        </HeroReveal>
        <aside className={styles.summaryPanel} aria-label="Programme summary">
          <dl className={styles.summaryList}>
            <div>
              <dt>Format</dt>
              <dd>{formatLabel(programme)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{deliveryLabel(programme)}</dd>
            </div>
            <div>
              <dt>Trial</dt>
              <dd>{programme.trialAvailable ? "Yes" : "Ask on enquiry"}</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>{hoursNote(programme)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className={styles.band} aria-labelledby="programme-overview">
        <SectionReveal>
          <h2 id="programme-overview" className={styles.sectionTitle}>
            At a glance
          </h2>
        </SectionReveal>
        <div className={styles.glanceGrid}>
          <div className={styles.glancePanel}>
            <p className={styles.glanceLabel}>Format</p>
            <p className={styles.glanceBody}>
              {programme.whoItsFor}
              {" · "}
              {formatLabel(programme)}
            </p>
          </div>
          <div className={styles.glancePanel}>
            <p className={styles.glanceLabel}>Availability</p>
            <p className={styles.glanceBody}>{batchLabel}</p>
          </div>
          <div className={styles.glancePanel}>
            <p className={styles.glanceLabel}>Trial &amp; pricing</p>
            <p className={styles.glanceBody}>
              {trialText}
              {" · "}
              {pricingText}
              {" · "}
              Group batches are typically up to 15 people
            </p>
          </div>
          {audienceParts.length > 0 ? (
            <div className={styles.glancePanel}>
              <p className={styles.glanceLabel}>Audience</p>
              <p className={styles.glanceBody}>{audienceParts.join(" · ")}</p>
            </div>
          ) : null}
        </div>
      </section>

      {programme.benefits.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-benefits">
          <SectionReveal>
            <h2 id="programme-benefits" className={styles.sectionTitle}>
              What the session may include
            </h2>
          </SectionReveal>
          <p className={styles.sectionNote}>{benefitsNote(programme)}</p>
          <ul className={styles.includeList}>
            {programme.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.band} aria-labelledby="programme-format" data-tempo={tempo}>
        <SectionReveal>
          <h2 id="programme-format" className={styles.sectionTitle}>
            Format &amp; delivery
          </h2>
        </SectionReveal>
        <div className={styles.splitFacts}>
          <div>
            <p className={styles.glanceLabel}>Format</p>
            <p className={styles.glanceBody}>{formatLabel(programme)}</p>
          </div>
          <div>
            <p className={styles.glanceLabel}>Delivery</p>
            <p className={styles.glanceBody}>{deliveryLabel(programme)}</p>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="programme-availability">
        <SectionReveal>
          <h2 id="programme-availability" className={styles.sectionTitle}>
            Availability
          </h2>
        </SectionReveal>
        <div className={styles.callout}>
          <p className={styles.glanceBody}>{batchLabel}</p>
          <Link href="/timetable" className={styles.relatedLink}>
            Ask about batch availability →
          </Link>
        </div>
      </section>

      {showRelated || showLocations ? (
        <section
          className={styles.band}
          aria-labelledby={
            showRelated ? "programme-related" : "programme-locations"
          }
        >
          <div
            className={
              showRelated && showLocations
                ? styles.splitFacts
                : undefined
            }
          >
            {showRelated ? (
              <div>
                <SectionReveal>
                  <h2 id="programme-related" className={styles.sectionTitle}>
                    Related services
                  </h2>
                </SectionReveal>
                <ul className={styles.relatedList}>
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/programs/${item.slug}`}
                        className={styles.relatedLink}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {showLocations ? (
              <div>
                <SectionReveal>
                  <h2 id="programme-locations" className={styles.sectionTitle}>
                    Relevant locations
                  </h2>
                </SectionReveal>
                <ul className={styles.relatedList}>
                  {locations.map((location) => (
                    <li key={location.slug}>
                      <Link href={location.href} className={styles.relatedLink}>
                        {location.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {programme.faqEntries && programme.faqEntries.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-faq">
          <SectionReveal>
            <h2 id="programme-faq" className={styles.sectionTitle}>
              FAQ
            </h2>
          </SectionReveal>
          <div className="pulse-accordion">
            {programme.faqEntries.map((faq) => (
              <details key={faq.id} className="pulse-accordion-item">
                <summary>{faq.question}</summary>
                <div className="pulse-accordion-panel">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className={`${styles.band} ${styles.closingCta}`}
        aria-labelledby="programme-trial-end"
      >
        <SectionReveal>
          <h2 id="programme-trial-end" className={styles.sectionTitle}>
            Enquire about a free trial
          </h2>
        </SectionReveal>
        <p className={styles.laneDesc}>
          Message Ankit’s Studio on WhatsApp about {programme.name}.
        </p>
        <div className={styles.ctaRow}>
          <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
        </div>
      </section>
    </div>
  );
}
