import Link from "next/link";
import type { Programme, ProgrammeSlug } from "@/content";
import { PulseMediaPlate } from "@/components/home/pulse/PulseMotion";
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

const FAMILY: Record<
  ProgrammeTempo,
  "strength" | "calm" | "high-energy" | "warm"
> = {
  functional: "strength",
  yoga: "calm",
  zumba: "high-energy",
  dance: "high-energy",
  wedding: "warm",
  home: "strength",
  online: "strength",
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
          <p>{programme.longDescription}</p>
          <div className={styles.ctaRow}>
            <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
            <p className={styles.ctaNote}>
              Opening WhatsApp starts a chat — it does not mean your enquiry was submitted.
            </p>
          </div>
        </div>
        <PulseMediaPlate
          slotKey={programme.mediaSlotKey}
          family={FAMILY[tempo]}
          label={`${programme.name} media placeholder — real photography pending`}
          aspect="16/9"
        />
      </section>

      <section className={styles.band} aria-labelledby="programme-facts">
        <h2 id="programme-facts" className={styles.sectionTitle}>
          Confirmed details
        </h2>
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <strong>Who may enquire</strong>
            <span>{programme.whoItsFor}</span>
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
                : "Trial status pending confirmation"}
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
            <strong>Batch schedule</strong>
            <span>
              {programme.batchScheduleStatus === "published"
                ? "See batch availability"
                : "Exact times vary by branch — ask on WhatsApp. Studios operate 6:00 AM–10:00 PM (operating window, not class rows)."}
            </span>
          </li>
          <li className={styles.fact}>
            <strong>Group size</strong>
            <span>Maximum 15 people per group batch</span>
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
              <span>Kids-only batches available on request — not a separate named service here</span>
            </li>
          ) : null}
        </ul>
      </section>

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
            are confirmed when you enquire — do not assume it is offered inside every studio.
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
          Message Ankit’s Studio on WhatsApp about {programme.name}. Opening the chat does not mean a
          message was delivered.
        </p>
        <div className={styles.ctaRow}>
          <ProgrammePulseCta href={whatsappHref}>{whatsappLabel}</ProgrammePulseCta>
        </div>
      </section>
    </div>
  );
}
