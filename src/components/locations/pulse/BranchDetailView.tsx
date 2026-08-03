import Link from "next/link";
import type { Branch, Programme } from "@/content";
import { WHATSAPP_REVIEW_HELPER } from "@/lib/conversion";
import { LocationPulseCta } from "./LocationPulseMotion";
import styles from "./location-pulse.module.css";

const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type BranchDetailViewProps = {
  branch: Branch;
  physicalProgrammes: Programme[];
  otherProgrammes: Programme[];
  mapsUrl: string | null;
  whatsappHref: string;
  whatsappLabel: string;
};

/**
 * Confirmed branch detail — only supported sections; pending fields stay honest.
 */
export function BranchDetailView({
  branch,
  physicalProgrammes,
  otherProgrammes,
  mapsUrl,
  whatsappHref,
  whatsappLabel,
}: BranchDetailViewProps) {
  const addressVisible = branch.address;
  const hoursLabel =
    branch.openingHours[0] != null
      ? `${formatClock(branch.openingHours[0].opensAt)}–${formatClock(branch.openingHours[0].closesAt)}`
      : "6:00 AM–10:00 PM";

  const orderedPhysical = [...physicalProgrammes].sort((a, b) => {
    const order = [
      "functional-training",
      "zumba",
      "yoga",
      "adult-dance",
      "wedding-choreography",
    ];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });

  return (
    <div className={styles.field}>
      <section className={styles.detailHero} aria-labelledby="branch-title">
        <div>
          <p className={styles.detailKicker}>Ankit’s Studio branch</p>
          {branch.openingStatus === "open" ? (
            <span className={styles.openBadge}>Open daily · {hoursLabel}</span>
          ) : null}
          <h1 id="branch-title">{branch.locality}</h1>
          <p>
            {branch.name}. Coach-led sessions at this neighbourhood studio. Ask on WhatsApp which
            batch fits you.
          </p>
          <div className={styles.ctaRow}>
            <LocationPulseCta href={whatsappHref}>{whatsappLabel}</LocationPulseCta>
            {mapsUrl ? (
              <a
                href={mapsUrl}
                className={styles.actionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            ) : null}
            <p className={styles.ctaNote}>{WHATSAPP_REVIEW_HELPER}</p>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="branch-address">
        <h2 id="branch-address" className={styles.sectionTitle}>
          Address &amp; directions
        </h2>
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <strong>Branch</strong>
            <span>{branch.locality}</span>
          </li>
          <li className={styles.fact}>
            <strong>Street address</strong>
            <span>
              {addressVisible ?? "Detailed address is being updated."}
            </span>
          </li>
          {branch.pinCode ? (
            <li className={styles.fact}>
              <strong>PIN</strong>
              <span>{branch.pinCode}</span>
            </li>
          ) : null}
          <li className={styles.fact}>
            <strong>Maps</strong>
            <span>
              {mapsUrl ? (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                  Open in Google Maps
                </a>
              ) : (
                "Maps link is being updated. Message WhatsApp for directions."
              )}
            </span>
          </li>
          {branch.phone ? (
            <li className={styles.fact}>
              <strong>Phone &amp; WhatsApp</strong>
              <span>
                <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className={styles.actionLink}>
                  {branch.phone}
                </a>
                {branch.inheritsCentralEnquiry
                  ? " — shared studio enquiry number for all branches"
                  : null}
              </span>
            </li>
          ) : null}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="branch-hours">
        <h2 id="branch-hours" className={styles.sectionTitle}>
          Operating hours
        </h2>
        <p className={styles.bandLede}>
          Open {hoursLabel}. Open every day — no weekly closing day. Individual batch times vary by
          programme.
        </p>
        <ul className={styles.facts}>
          {branch.openingHours.map((entry) => (
            <li key={entry.dayOfWeek} className={styles.fact}>
              <strong>{DAY_LABELS[entry.dayOfWeek] ?? `Day ${entry.dayOfWeek}`}</strong>
              <span>
                {formatClock(entry.opensAt)} – {formatClock(entry.closesAt)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="branch-batches">
        <h2 id="branch-batches" className={styles.sectionTitle}>
          Batch availability
        </h2>
        <p className={styles.bandLede}>
          Message WhatsApp with your preferred service and time — we confirm current batches when you
          enquire.
        </p>
      </section>

      <section className={styles.band} aria-labelledby="branch-services">
        <h2 id="branch-services" className={styles.sectionTitle}>
          Available at this branch
        </h2>
        <p className={styles.bandLede}>
          Studio services offered at this branch. Functional Training is a primary fitness focus
          without excluding other programmes.
        </p>
        <ul className={styles.serviceList}>
          {orderedPhysical.map((programme) => (
            <li key={programme.slug}>
              <Link
                href={`/programs/${programme.slug}`}
                data-emphasis={programme.slug === "functional-training" ? "primary" : undefined}
              >
                <span className={styles.serviceName}>{programme.name}</span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="branch-audience">
        <h2 id="branch-audience" className={styles.sectionTitle}>
          Audience options
        </h2>
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <strong>Ladies-only batches</strong>
            <span>
              {branch.ladiesOnlyBatchesAvailable
                ? "Available as a batch option — ask WhatsApp for current fit at this branch."
                : "Not listed for this branch."}
            </span>
          </li>
          <li className={styles.fact}>
            <strong>Kids-only batches</strong>
            <span>
              {branch.kidsOnlyBatchesAvailable
                ? "Available as a batch option — ask WhatsApp for current fit at this branch."
                : "Not listed for this branch."}
            </span>
          </li>
          {branch.maxGroupBatchSize != null ? (
            <li className={styles.fact}>
              <strong>Group size</strong>
              <span>Group batches are typically up to {branch.maxGroupBatchSize} people</span>
            </li>
          ) : null}
        </ul>
      </section>

      {otherProgrammes.length > 0 ? (
        <section className={styles.band} aria-labelledby="branch-other-ways">
          <h2 id="branch-other-ways" className={styles.sectionTitle}>
            Other ways to train with Ankit’s Studio
          </h2>
          <p className={styles.bandLede}>
            These are delivery modes — not classes held on this branch floor.
          </p>
          <ul className={styles.relatedList}>
            {otherProgrammes.map((programme) => (
              <li key={programme.slug}>
                <Link href={`/programs/${programme.slug}`}>
                  <span className={styles.serviceName}>{programme.name}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.band} aria-labelledby="branch-faq">
        <h2 id="branch-faq" className={styles.sectionTitle}>
          FAQ
        </h2>
        <ul className={styles.faqList}>
          {branch.faqEntries.map((faq) => (
            <li key={faq.id}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="branch-final-cta">
        <h2 id="branch-final-cta" className={styles.sectionTitle}>
          Book a free trial
        </h2>
        <div className={styles.finalCta}>
          <p className={styles.bandLede}>
            Prefer {branch.locality}? Start on WhatsApp with this branch already filled in. Fields
            are optional — you can send as soon as you are ready.
          </p>
          <LocationPulseCta href={whatsappHref}>{whatsappLabel}</LocationPulseCta>
        </div>
      </section>
    </div>
  );
}

function formatClock(value: string): string {
  const [hRaw, mRaw] = value.split(":");
  const h = Number(hRaw);
  const m = mRaw ?? "00";
  if (!Number.isFinite(h)) return value;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${suffix}`;
}
