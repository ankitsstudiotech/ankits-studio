import Link from "next/link";
import type { Programme, ProgrammeSlug } from "@/content";
import { FaqBlock } from "@/components/content/FaqBlock";
import { ClosingBand } from "@/components/conversion/ClosingBand";
import { PulseMedia } from "@/components/media";
import { MaskedLines, SectionReveal } from "@/components/motion";
import { toneFromProgrammeSlug } from "@/components/motion/tokens";
import { isServiceEnquiryProgramme } from "@/lib/conversion";
import { programmeHeroSlotKey, resolveSlotMedia } from "@/content/media";
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
  "corporate-wellness": "corporate",
};

/** Stage 5 — four composition families (not seven page forks). */
export type ComposeFamily = "structured" | "fluid" | "calm" | "service";

export function composeFamilyFromSlug(slug: string): ComposeFamily {
  switch (slug) {
    case "functional-training":
      return "structured";
    case "zumba":
    case "adult-dance":
      return "fluid";
    case "yoga":
      return "calm";
    case "wedding-choreography":
    case "home-personal-training":
    case "online-training":
    case "corporate-wellness":
      return "service";
    default:
      return "structured";
  }
}

const GENERIC_FAQ_IDS = new Set(["ft-trial", "ft-price", "yoga-trial"]);

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
    case "corporate-wellness":
      return "Programme scope is tailored after enquiry with your HR or admin contact.";
    default:
      return "Session details vary — ask what to expect when you enquire.";
  }
}

function snapshotTitle(programme: Programme): string {
  switch (programme.slug) {
    case "functional-training":
      return "The session, at a glance";
    case "yoga":
      return "What to expect";
    case "zumba":
    case "adult-dance":
      return "Class snapshot";
    case "wedding-choreography":
      return "What we arrange";
    case "home-personal-training":
      return "Training at your location";
    case "online-training":
      return "Training from anywhere";
    case "corporate-wellness":
      return "Corporate programme snapshot";
    default:
      return "Service snapshot";
  }
}

function deliveryLabel(programme: Programme): string {
  if (programme.deliveryMode === "home") {
    return "Training is delivered at your location.";
  }
  if (programme.deliveryMode === "online") {
    return "Remote sessions via Zoom (one-to-one and group).";
  }
  if (programme.slug === "corporate-wellness") {
    return "Delivered at your workplace or online — planned with your team.";
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

function padIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function hoursNote(programme: Programme): string {
  if (programme.deliveryMode === "home" || programme.deliveryMode === "online") {
    return "Session times arranged on enquiry.";
  }
  return "Studios open 6:00 AM–10:00 PM every day.";
}

function availabilityCopy(programme: Programme): string {
  if (isServiceEnquiryProgramme(programme)) {
    return "Programmes are arranged after enquiry. Plans depend on team size, objectives, duration, location, schedule, and workplace or online delivery — availability is confirmed with the studio when you enquire.";
  }
  if (programme.deliveryMode === "home" || programme.deliveryMode === "online") {
    return "Session times are arranged when you enquire.";
  }
  if (programme.batchScheduleStatus === "published") {
    return "See batch availability for current options.";
  }
  return "Batch times vary by branch. Message us for current options — studios open 6:00 AM–10:00 PM every day.";
}

function buildMetaFacts(programme: Programme): MetaFact[] {
  if (isServiceEnquiryProgramme(programme)) {
    return [
      { label: "Format", body: "Workplace or online" },
      { label: "Programme", body: "Customised to organisation requirements" },
      { label: "Scheduling", body: "Planned around team, location and availability" },
      { label: "Pricing", body: "Shared on enquiry" },
    ];
  }

  return [
    { label: "Format", body: formatLabel(programme) },
    { label: "Delivery", body: deliveryLabel(programme) },
    { label: "Trial", body: programme.trialAvailable ? "Yes" : "Ask on enquiry" },
    { label: "Hours", body: hoursNote(programme) },
  ];
}

export type ProgrammeDetailViewProps = {
  programme: Programme;
  locations: Array<{ slug: string; name: string; href: string }>;
  related: Array<{ slug: ProgrammeSlug; name: string }>;
  whatsappHref: string;
  whatsappLabel: string;
};

type MetaFact = { label: string; body: string };

/**
 * Programme detail — Stage 5 composition families share one component tree.
 * Personality via data-compose-family + data-tempo / motion tone — not seven forks.
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
  const composeFamily = composeFamilyFromSlug(programme.slug);
  const heroSlot = programmeHeroSlotKey(programme.slug);
  const heroMedia = heroSlot ? resolveSlotMedia(heroSlot) : null;
  const actionMedia =
    programme.slug === "functional-training"
      ? resolveSlotMedia("programme.functional.action")
      : null;
  const batchLabel = availabilityCopy(programme);
  const serviceEnquiry = isServiceEnquiryProgramme(programme);

  const clusterKicker =
    programme.serviceCluster === "train"
      ? "Train"
      : programme.serviceCluster === "move"
        ? "Move"
        : programme.serviceCluster === "celebrate"
          ? "Celebrate"
          : programme.serviceCluster === "teams"
            ? "For Teams"
            : "Programme";

  const audienceParts: string[] = [];
  if (!serviceEnquiry && programme.ladiesOnlyBatchesAvailable) {
    audienceParts.push("Ladies-only batches available on request");
  }
  if (!serviceEnquiry && programme.kidsOnlyBatchesAvailable) {
    audienceParts.push("Kids-only batches available on request");
  }

  const showStudioLocations =
    !serviceEnquiry && locations.length > 0 && programme.deliveryMode === "in-studio";
  const relatedItems = related.slice(0, 3);
  const showRelated = relatedItems.length > 0;

  const faqs = (programme.faqEntries ?? [])
    .filter((faq) => !GENERIC_FAQ_IDS.has(faq.id))
    .filter((faq) => {
      if (audienceParts.length === 0) return true;
      return !/ladies|kids-only|kids only/i.test(faq.question);
    })
    .filter((faq) => {
      if (!programme.classStructure) return true;
      return !/how long|duration|session length/i.test(faq.question);
    })
    .slice(0, 3);

  const glancePanels: Array<{ label: string; body: string }> = [];
  if (programme.whoItsFor) {
    glancePanels.push({ label: "Who it’s for", body: programme.whoItsFor });
  }
  if (programme.classStructure) {
    glancePanels.push({ label: "Session", body: programme.classStructure });
  }
  if (audienceParts.length > 0) {
    glancePanels.push({ label: "Options", body: audienceParts.join(" · ") });
  }

  const metaFacts = buildMetaFacts(programme);

  const titleLines =
    programme.slug === "home-personal-training"
      ? ["Home personal", "training"]
      : programme.slug === "wedding-choreography"
        ? ["Wedding", "choreography"]
        : programme.slug === "functional-training"
          ? ["Functional", "training"]
          : programme.slug === "online-training"
            ? ["Online", "training"]
            : [programme.name];

  return (
    <div
      className={styles.field}
      data-motion-tone={motionTone}
      data-compose-family={composeFamily}
      data-service-variant={tempo}
    >
      <section
        className={styles.detailHero}
        data-tempo={tempo}
        data-motion-tone={motionTone}
        data-compose-family={composeFamily}
        data-service-variant={tempo}
        data-has-media={heroMedia ? "true" : "false"}
        aria-labelledby="programme-title"
      >
        <div
          className={[
            styles.composeHero,
            heroMedia ? styles.composeHeroWithMedia : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={styles.detailOpening}>
            <p className={`hero-brand-motion ${styles.detailKicker}`}>{clusterKicker}</p>
            <MaskedLines
              id="programme-title"
              as="h1"
              lines={titleLines}
              className={styles.detailTitle}
            />
            <div className={`hero-support ${styles.detailSupport}`}>
              <p className={styles.detailLede}>{programme.shortDescription}</p>
              <div id="programme-hero-cta" className={styles.ctaRow}>
                <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
              </div>
            </div>
            <span className={`hero-accent-motion programme-cue ${styles.detailAccent}`} aria-hidden />
          </div>

          {heroMedia ? (
            <div className={styles.detailMedia}>
              <PulseMedia
                item={heroMedia}
                sizes="(max-width: 900px) 100vw, (max-width: 1440px) 42vw, 720px"
                priority
                reveal={false}
              />
            </div>
          ) : null}

          <aside
            className={`${styles.metaRail} ${styles.summaryMotion}`}
            aria-label="Programme summary"
          >
            <dl className={styles.metaList}>
              {metaFacts.map((fact) => (
                <div key={fact.label} className={styles.metaItem}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {glancePanels.length > 0 ? (
        <section
          className={`${styles.band} ${styles.snapshotBand}`}
          aria-labelledby="programme-overview"
          data-compose-family={composeFamily}
        >
          <SectionReveal>
            <h2 id="programme-overview" className={styles.sectionTitle}>
              {snapshotTitle(programme)}
            </h2>
          </SectionReveal>
          <div className={styles.snapshotFacts} data-count={glancePanels.length}>
            {glancePanels.map((panel, index) => (
              <div key={panel.label} className={styles.snapshotFact}>
                <p className={styles.editorialIndex} aria-hidden="true">
                  {padIndex(index)}
                </p>
                <p className={styles.glanceLabel}>{panel.label}</p>
                <p className={styles.glanceBody}>{panel.body}</p>
              </div>
            ))}
          </div>
          {faqs.length === 1 ? <FaqBlock items={faqs} /> : null}
        </section>
      ) : faqs.length === 1 ? (
        <section className={styles.band}>
          <FaqBlock items={faqs} />
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
          <div className={actionMedia ? styles.includeWithMedia : undefined}>
            <ul className={styles.includeList} data-count={programme.benefits.length}>
              {programme.benefits.map((benefit, index) => (
                <li key={benefit}>
                  <span className={styles.editorialIndex} aria-hidden="true">
                    {padIndex(index)}
                  </span>
                  <span className={styles.includeText}>{benefit}</span>
                </li>
              ))}
            </ul>
            {actionMedia ? (
              <div className={styles.actionMedia}>
                <PulseMedia
                  item={actionMedia}
                  sizes="(max-width: 900px) 100vw, 28vw"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section
        className={`${styles.band} ${styles.availabilityBand}`}
        aria-labelledby="programme-availability"
      >
        <div className={styles.availabilityStrip}>
          <SectionReveal>
            <h2 id="programme-availability" className={styles.availabilityLabel}>
              {serviceEnquiry ? "Planning & availability" : "Availability"}
            </h2>
          </SectionReveal>
          <p className={styles.availabilityCopy}>{batchLabel}</p>
          {serviceEnquiry ? (
            <a href={whatsappHref} className={styles.availabilityAction}>
              Enquire on WhatsApp →
            </a>
          ) : programme.deliveryMode === "in-studio" ? (
            <Link href="/timetable" className={styles.availabilityAction}>
              Ask about batch availability →
            </Link>
          ) : (
            <Link href="/pricing" className={styles.availabilityAction}>
              Ask about current fees →
            </Link>
          )}
        </div>
      </section>

      {showRelated || showStudioLocations ? (
        <section
          className={styles.band}
          data-discovery="related-close"
          aria-labelledby={
            showRelated ? "programme-related" : "programme-locations"
          }
        >
          <div
            className={styles.relatedDiscovery}
            data-has-studio={showStudioLocations ? "true" : "false"}
          >
            {showRelated ? (
              <>
                <SectionReveal>
                  <h2 id="programme-related" className={styles.sectionTitle}>
                    Related services
                  </h2>
                </SectionReveal>
                <div className={styles.relatedFrame}>
                  <ul className={styles.relatedIndex} data-count={relatedItems.length}>
                    {relatedItems.map((item, index) => (
                      <li key={item.slug}>
                        <Link
                          href={`/programs/${item.slug}`}
                          className={styles.relatedIndexLink}
                        >
                          <span className={styles.editorialIndex} aria-hidden="true">
                            {padIndex(index)}
                          </span>
                          <span className={styles.relatedIndexName}>{item.name}</span>
                          <span className={styles.relatedIndexArrow} aria-hidden="true">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {showStudioLocations ? (
                    <Link
                      href="/locations"
                      className={styles.relatedStudio}
                      aria-labelledby="programme-locations"
                    >
                      <span id="programme-locations" className={styles.relatedFindLabel}>
                        Train near you
                      </span>
                      <span className={styles.relatedFind}>Find a studio</span>
                      <span className={styles.relatedIndexArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  ) : null}
                </div>
              </>
            ) : showStudioLocations ? (
              <div className={styles.relatedFrame}>
                <Link
                  href="/locations"
                  className={styles.relatedStudio}
                  aria-labelledby="programme-locations"
                >
                  <span id="programme-locations" className={styles.relatedFindLabel}>
                    Train near you
                  </span>
                  <span className={styles.relatedFind}>Find a studio</span>
                  <span className={styles.relatedIndexArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {faqs.length >= 2 ? (
        <section className={styles.band}>
          <FaqBlock items={faqs} titleId="programme-faq" />
        </section>
      ) : null}

      <ClosingBand
        id="programme-closing"
        titleId="programme-closing-cta"
        variant="compact"
        title={
          serviceEnquiry
            ? "Planning wellness for your team?"
            : "Enquire about a free trial"
        }
        body={
          serviceEnquiry
            ? "Customised workplace and online programmes are arranged around your organisation’s requirements."
            : `Message Ankit’s Studio on WhatsApp about ${programme.name}.`
        }
      >
        <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
      </ClosingBand>
    </div>
  );
}
