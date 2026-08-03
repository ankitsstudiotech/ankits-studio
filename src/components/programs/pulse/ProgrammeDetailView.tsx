import Link from "next/link";
import type { Programme, ProgrammeSlug } from "@/content";
import { HeroReveal, SectionReveal } from "@/components/motion";
import { WHATSAPP_REVIEW_HELPER } from "@/lib/conversion";
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
          <p>{programme.shortDescription}</p>
          <div className={styles.ctaRow}>
            <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
            <p className={styles.ctaNote}>{WHATSAPP_REVIEW_HELPER}</p>
          </div>
        </HeroReveal>
      </section>

      <section className={styles.band} aria-labelledby="programme-overview">
        <SectionReveal>
          <h2 id="programme-overview" className={styles.sectionTitle}>
            At a glance
          </h2>
        </SectionReveal>
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <strong>Who it’s for</strong>
            <span>{programme.whoItsFor}</span>
          </li>
          <li className={styles.fact}>
            <strong>Class structure</strong>
            <span>{programme.classStructure}</span>
          </li>
          <li className={styles.fact}>
            <strong>Batch times</strong>
            <span>{batchLabel}</span>
          </li>
          <li className={styles.fact}>
            <strong>Delivery</strong>
            <span>{deliveryLabel(programme)}</span>
          </li>
          <li className={styles.fact}>
            <strong>Trial</strong>
            <span>
              {programme.trialAvailable
                ? "Free trial available — enquire on WhatsApp"
                : "Ask about a trial when you enquire"}
            </span>
          </li>
          <li className={styles.fact}>
            <strong>Pricing</strong>
            <span>
              {programme.pricingStatus === "published"
                ? "See pricing page"
                : "Programme fees confirmed on enquiry · ₹300 one-time registration after you join"}
            </span>
          </li>
          <li className={styles.fact}>
            <strong>Group size</strong>
            <span>Group batches are typically up to 15 people</span>
          </li>
          {programme.ladiesOnlyBatchesAvailable ? (
            <li className={styles.fact}>
              <strong>Ladies-only</strong>
              <span>Ladies-only batches available on request</span>
            </li>
          ) : null}
          {programme.kidsOnlyBatchesAvailable ? (
            <li className={styles.fact}>
              <strong>Kids-only</strong>
              <span>Kids-only batches available on request</span>
            </li>
          ) : null}
        </ul>
      </section>

      {programme.benefits.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-benefits">
          <SectionReveal>
            <h2 id="programme-benefits" className={styles.sectionTitle}>
              What the session may include
            </h2>
          </SectionReveal>
          <ul className={styles.facts}>
            {programme.benefits.map((benefit) => (
              <li key={benefit} className={styles.fact}>
                <span>{benefit}</span>
              </li>
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
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <strong>Format</strong>
            <span>{formatLabel(programme)}</span>
          </li>
          <li className={styles.fact}>
            <strong>Delivery</strong>
            <span>{deliveryLabel(programme)}</span>
          </li>
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="programme-availability">
        <SectionReveal>
          <h2 id="programme-availability" className={styles.sectionTitle}>
            Availability
          </h2>
        </SectionReveal>
        <p className={styles.laneDesc}>{batchLabel}</p>
        <p className={styles.ctaNote} style={{ marginTop: "0.75rem" }}>
          <Link href="/timetable" className={styles.relatedLink}>
            Ask about batch availability →
          </Link>
        </p>
      </section>

      {related.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-related">
          <SectionReveal>
            <h2 id="programme-related" className={styles.sectionTitle}>
              Related services
            </h2>
          </SectionReveal>
          <ul className={styles.relatedList}>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/programs/${item.slug}`} className={styles.relatedLink}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {locations.length > 0 && programme.deliveryMode === "in-studio" ? (
        <section className={styles.band} aria-labelledby="programme-locations">
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

      <section className={styles.band} aria-labelledby="programme-trial-end">
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
          <p className={styles.ctaNote}>{WHATSAPP_REVIEW_HELPER}</p>
        </div>
      </section>
    </div>
  );
}
