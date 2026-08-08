import Link from "next/link";
import type { Programme, ProgrammeSlug } from "@/content";
import { MaskedLines, SectionReveal } from "@/components/motion";
import { toneFromProgrammeSlug } from "@/components/motion/tokens";
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

/** Generic trial/pricing FAQs already covered in the summary / availability callout. */
const GENERIC_FAQ_IDS = new Set([
  "ft-trial",
  "ft-price",
  "yoga-trial",
]);

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

function availabilityCopy(programme: Programme): string {
  if (programme.deliveryMode === "home" || programme.deliveryMode === "online") {
    return "Session times are arranged when you enquire.";
  }
  if (programme.batchScheduleStatus === "published") {
    return "See batch availability for current options.";
  }
  return "Batch times vary by branch. Message us for current options — studios open 6:00 AM–10:00 PM every day.";
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
  const motionTone = toneFromProgrammeSlug(programme.slug);
  const batchLabel = availabilityCopy(programme);

  const clusterKicker =
    programme.serviceCluster === "train"
      ? "Train"
      : programme.serviceCluster === "move"
        ? "Move"
        : programme.serviceCluster === "celebrate"
          ? "Celebrate"
          : "Programme";

  const audienceParts: string[] = [];
  if (programme.ladiesOnlyBatchesAvailable) {
    audienceParts.push("Ladies-only batches available on request");
  }
  if (programme.kidsOnlyBatchesAvailable) {
    audienceParts.push("Kids-only batches available on request");
  }

  const showStudioLocations =
    locations.length > 0 && programme.deliveryMode === "in-studio";
  const relatedItems = related.slice(0, 3);
  const showRelated = relatedItems.length > 0;

  const faqs = (programme.faqEntries ?? [])
    .filter((faq) => !GENERIC_FAQ_IDS.has(faq.id))
    .slice(0, 3);

  // Prefer programme-specific glance facts — skip repeating hero summary verbatim.
  const glancePanels: Array<{ label: string; body: string }> = [];
  if (programme.whoItsFor) {
    glancePanels.push({ label: "Who it’s for", body: programme.whoItsFor });
  }
  if (audienceParts.length > 0) {
    glancePanels.push({ label: "Audience", body: audienceParts.join(" · ") });
  }
  if (programme.trialAvailable) {
    glancePanels.push({
      label: "Trial",
      body: "Free trial available — enquire on WhatsApp",
    });
  }

  return (
    <div className={styles.field} data-motion-tone={motionTone}>
      <section
        className={styles.detailHero}
        data-tempo={tempo}
        data-motion-tone={motionTone}
        aria-labelledby="programme-title"
      >
        <div className={styles.detailOpening}>
          <p className={`hero-brand-motion ${styles.detailKicker}`}>{clusterKicker}</p>
          <MaskedLines
            id="programme-title"
            as="h1"
            lines={[programme.name]}
            className={styles.detailTitle}
          />
          <div className={`hero-support ${styles.detailSupport}`}>
            <p className={styles.detailLede}>{programme.shortDescription}</p>
            <div className={styles.ctaRow}>
              <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
            </div>
          </div>
          <span className={`hero-accent-motion ${styles.detailAccent}`} aria-hidden />
        </div>
        <aside
          className={`${styles.summaryPanel} ${styles.summaryMotion}`}
          aria-label="Programme summary"
        >
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

      {glancePanels.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-overview">
          <SectionReveal>
            <h2 id="programme-overview" className={styles.sectionTitle}>
              At a glance
            </h2>
          </SectionReveal>
          <div className={styles.glanceGrid}>
            {glancePanels.map((panel) => (
              <div key={panel.label} className={styles.glancePanel}>
                <p className={styles.glanceLabel}>{panel.label}</p>
                <p className={styles.glanceBody}>{panel.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

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

      <section className={styles.band} aria-labelledby="programme-availability">
        <SectionReveal>
          <h2 id="programme-availability" className={styles.sectionTitle}>
            Availability
          </h2>
        </SectionReveal>
        <div className={styles.callout}>
          <p className={styles.glanceBody}>{batchLabel}</p>
          {programme.deliveryMode === "in-studio" ? (
            <Link href="/timetable" className={styles.relatedLink}>
              Ask about batch availability →
            </Link>
          ) : (
            <Link href="/pricing" className={styles.relatedLink}>
              Ask about current fees →
            </Link>
          )}
        </div>
      </section>

      {showRelated || showStudioLocations ? (
        <section
          className={styles.band}
          aria-labelledby={
            showRelated ? "programme-related" : "programme-locations"
          }
        >
          <div
            className={
              showRelated && showStudioLocations ? styles.splitFacts : undefined
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
                  {relatedItems.map((item) => (
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
            {showStudioLocations ? (
              <div>
                <SectionReveal>
                  <h2 id="programme-locations" className={styles.sectionTitle}>
                    Locations
                  </h2>
                </SectionReveal>
                <p className={styles.glanceBody}>
                  Available across our four studios.
                </p>
                <Link href="/locations" className={styles.relatedLink}>
                  Find a studio →
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-faq">
          <SectionReveal>
            <h2 id="programme-faq" className={styles.sectionTitle}>
              FAQ
            </h2>
          </SectionReveal>
          <div className="pulse-accordion">
            {faqs.map((faq) => (
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
