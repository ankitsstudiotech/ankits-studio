import Link from "next/link";
import type { Programme, ProgrammeSlug } from "@/content";
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

export function ProgrammeDetailView({
  programme,
  locations,
  related,
  whatsappHref,
  whatsappLabel,
}: ProgrammeDetailViewProps) {
  const tempo = SLUG_TEMPO[programme.slug] ?? "functional";
  const deliveryLabel =
    programme.deliveryMode === "home"
      ? "Home delivery (not a branch-floor class)"
      : programme.deliveryMode === "online"
        ? "Online delivery (not a branch-floor class)"
        : "Studio sessions at listed branches";

  const batchLabel =
    programme.batchScheduleStatus === "published"
      ? "See batch availability"
      : "Exact times vary by branch — ask on WhatsApp. Studios are open 6:00 AM–10:00 PM daily.";

  return (
    <div className={styles.field}>
      <section
        className={styles.detailHero}
        data-tempo={tempo}
        aria-labelledby="programme-title"
      >
        <div>
          <p className={styles.detailKicker}>
            {programme.serviceCluster === "train"
              ? "Train"
              : programme.serviceCluster === "move"
                ? "Move"
                : programme.serviceCluster === "celebrate"
                  ? "Celebrate"
                  : "Programme"}
          </p>
          <h1 id="programme-title">{programme.name}</h1>
          <p>{programme.shortDescription}</p>
          <div className={styles.ctaRow}>
            <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
            <p className={styles.ctaNote}>{WHATSAPP_REVIEW_HELPER}</p>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="programme-overview">
        <h2 id="programme-overview" className={styles.sectionTitle}>
          At a glance
        </h2>
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
            <span>{deliveryLabel}</span>
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
          <h2 id="programme-benefits" className={styles.sectionTitle}>
            What the session may include
          </h2>
          <p className={styles.ctaNote} style={{ marginBottom: "0.85rem" }}>
            Not every tool appears in every session or branch.
          </p>
          <ul className={styles.facts}>
            {programme.benefits.map((benefit) => (
              <li key={benefit} className={styles.fact}>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {locations.length > 0 && programme.deliveryMode === "in-studio" ? (
        <section className={styles.band} aria-labelledby="programme-locations">
          <h2 id="programme-locations" className={styles.sectionTitle}>
            Relevant locations
          </h2>
          <ul className={styles.relatedList}>
            {locations.map((location) => (
              <li key={location.slug}>
                <Link href={location.href}>{location.name}</Link>
              </li>
            ))}
          </ul>
          <p className={styles.ctaNote} style={{ marginTop: "0.75rem" }}>
            <Link href="/timetable">Ask about batch availability →</Link>
          </p>
        </section>
      ) : null}

      {programme.deliveryMode !== "in-studio" ? (
        <section className={styles.band} aria-labelledby="programme-delivery-note">
          <h2 id="programme-delivery-note" className={styles.sectionTitle}>
            Delivery note
          </h2>
          <p className={styles.laneDesc}>
            This service is not tied to a physical branch floor class. Coverage, platform, and timing
            are confirmed when you enquire.
          </p>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-related">
          <h2 id="programme-related" className={styles.sectionTitle}>
            Related services
          </h2>
          <ul className={styles.relatedList}>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/programs/${item.slug}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {programme.faqEntries && programme.faqEntries.length > 0 ? (
        <section className={styles.band} aria-labelledby="programme-faq">
          <h2 id="programme-faq" className={styles.sectionTitle}>
            FAQ
          </h2>
          <ul className={styles.facts}>
            {programme.faqEntries.map((faq) => (
              <li key={faq.id} className={styles.fact}>
                <strong>{faq.question}</strong>
                <span>{faq.answer}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.band} aria-labelledby="programme-trial-end">
        <h2 id="programme-trial-end" className={styles.sectionTitle}>
          Enquire about a free trial
        </h2>
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
