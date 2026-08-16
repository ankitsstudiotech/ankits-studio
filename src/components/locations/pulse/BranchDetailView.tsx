import Link from "next/link";
import type { Branch, Programme } from "@/content";
import { HeroReveal, SectionReveal } from "@/components/motion";
import { LocationPulseCta } from "./LocationPulseMotion";
import styles from "./location-pulse.module.css";

export type BranchDetailViewProps = {
  branch: Branch;
  physicalProgrammes: Programme[];
  otherProgrammes: Programme[];
  mapsUrl: string | null;
  whatsappHref: string;
  whatsappLabel: string;
};

/**
 * Confirmed branch detail — opening, hours, address, services, batch, CTA.
 */
export function BranchDetailView({
  branch,
  physicalProgrammes,
  otherProgrammes,
  mapsUrl,
  whatsappHref,
  whatsappLabel,
}: BranchDetailViewProps) {
  const hoursLabel =
    branch.openingHours[0] != null
      ? `${formatClock(branch.openingHours[0].opensAt)}–${formatClock(branch.openingHours[0].closesAt)}`
      : "6:00 AM–10:00 PM";

  const addressLine = [branch.address, branch.pinCode ? `PIN ${branch.pinCode}` : null]
    .filter(Boolean)
    .join(" · ");

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
        <HeroReveal>
          <p className={styles.detailKicker}>Ankit’s Studio</p>
          {branch.openingStatus === "open" ? (
            <span className={styles.openBadge}>Open daily · {hoursLabel}</span>
          ) : null}
          <h1 id="branch-title">{branch.locality}</h1>
          {addressLine ? <p className={styles.detailAddress}>{addressLine}</p> : null}
          <p>
            Coach-led sessions at this neighbourhood studio. Ask on WhatsApp which batch fits you.
          </p>
          <div className={styles.ctaRow}>
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
            <LocationPulseCta href={whatsappHref}>{whatsappLabel}</LocationPulseCta>
          </div>
        </HeroReveal>
      </section>

      <section className={styles.band} aria-labelledby="branch-address">
        <SectionReveal>
          <h2 id="branch-address" className={styles.sectionTitle}>
            Address &amp; contact
          </h2>
        </SectionReveal>
        <ul className="pulse-info-grid">
          <li>
            <strong>Address</strong>
            {addressLine || "Message us on WhatsApp for the address."}
          </li>
          <li>
            <strong>Maps</strong>
            {mapsUrl ? (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                Open in Google Maps
              </a>
            ) : (
              "Message WhatsApp for directions to this studio."
            )}
          </li>
          {branch.phone ? (
            <li>
              <strong>Phone &amp; WhatsApp</strong>
              <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className={styles.actionLink}>
                {branch.phone}
              </a>
              {branch.inheritsCentralEnquiry ? (
                <span className={styles.placeMeta}>
                  {" "}
                  Shared enquiry number across all branches
                </span>
              ) : null}
            </li>
          ) : null}
        </ul>
      </section>

      {(branch.nearestStation ||
        branch.landmarks ||
        branch.parking ||
        (branch.nearbyTransport && branch.nearbyTransport.length > 0) ||
        (branch.facilities && branch.facilities.length > 0)) && (
        <section className={styles.band} aria-labelledby="branch-getting-here">
          <SectionReveal>
            <h2 id="branch-getting-here" className={styles.sectionTitle}>
              Getting here
            </h2>
          </SectionReveal>
          <ul className="pulse-info-grid">
            {branch.openingYear ? (
              <li>
                <strong>Studio since</strong>
                {branch.openingYear}
              </li>
            ) : null}
            {branch.nearestStation ? (
              <li>
                <strong>Nearest station</strong>
                {branch.nearestStation}
              </li>
            ) : null}
            {branch.landmarks ? (
              <li>
                <strong>Landmark</strong>
                {branch.landmarks}
              </li>
            ) : null}
            {branch.nearbyTransport?.map((note) => (
              <li key={note}>
                <strong>Travel</strong>
                {note}
              </li>
            ))}
            {branch.parking ? (
              <li>
                <strong>Parking</strong>
                {branch.parking}
              </li>
            ) : null}
            {branch.facilities && branch.facilities.length > 0 ? (
              <li>
                <strong>Available</strong>
                {branch.facilities.join(" · ")}
              </li>
            ) : null}
            <li>
              <strong>Not available</strong>
              Lift
            </li>
          </ul>
        </section>
      )}

      <section
        className={styles.band}
        data-discovery="service-index"
        aria-labelledby="branch-services"
      >
        <SectionReveal>
          <h2 id="branch-services" className={styles.sectionTitle}>
            Available at this branch
          </h2>
        </SectionReveal>
        <ul className={styles.serviceIndex}>
          {orderedPhysical.map((programme) => (
            <li key={programme.slug}>
              <Link
                href={`/programs/${programme.slug}`}
                className={styles.serviceIndexLink}
                data-emphasis={programme.slug === "functional-training" ? "primary" : undefined}
              >
                <span className={styles.serviceName}>{programme.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="branch-batches">
        <SectionReveal>
          <h2 id="branch-batches" className={styles.sectionTitle}>
            Batch guidance
          </h2>
        </SectionReveal>
        <p className={styles.bandLede}>
          Message WhatsApp with your preferred service and time — we confirm current batches when you
          enquire. Studios open {hoursLabel} every day.
        </p>
        {(branch.ladiesOnlyBatchesAvailable ||
          branch.kidsOnlyBatchesAvailable ||
          branch.maxGroupBatchSize != null) && (
          <ul className="pulse-info-grid" style={{ marginTop: "1rem" }}>
            {branch.ladiesOnlyBatchesAvailable ? (
              <li>
                <strong>Ladies-only</strong>
                Available as a batch option — ask WhatsApp for current fit.
              </li>
            ) : null}
            {branch.kidsOnlyBatchesAvailable ? (
              <li>
                <strong>Kids-only</strong>
                Available as a batch option — ask WhatsApp for current fit.
              </li>
            ) : null}
            {branch.maxGroupBatchSize != null ? (
              <li>
                <strong>Group size</strong>
                Group batches are typically up to {branch.maxGroupBatchSize} people
              </li>
            ) : null}
          </ul>
        )}
      </section>

      {otherProgrammes.length > 0 ? (
        <section
          className={styles.band}
          data-discovery="service-index"
          aria-labelledby="branch-other-ways"
        >
          <SectionReveal>
            <h2 id="branch-other-ways" className={styles.sectionTitle}>
              Home, online &amp; corporate
            </h2>
          </SectionReveal>
          <ul className={styles.serviceIndex}>
            {otherProgrammes.map((programme) => (
              <li key={programme.slug}>
                <Link href={`/programs/${programme.slug}`} className={styles.serviceIndexLink}>
                  <span className={styles.serviceName}>{programme.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {branch.faqEntries.length > 0 ? (
        <section className={styles.band} aria-labelledby="branch-faq">
          <SectionReveal>
            <h2 id="branch-faq" className={styles.sectionTitle}>
              FAQ
            </h2>
          </SectionReveal>
          <div className="pulse-accordion">
            {branch.faqEntries.map((faq) => (
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

      <section className={styles.band} aria-labelledby="branch-final-cta">
        <SectionReveal>
          <h2 id="branch-final-cta" className={styles.sectionTitle}>
            Book a free trial
          </h2>
        </SectionReveal>
        <div className={styles.finalCta}>
          <p className={styles.bandLede}>
            Prefer {branch.locality}? Message WhatsApp to book a free trial here.
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
