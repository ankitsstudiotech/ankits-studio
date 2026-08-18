import Link from "next/link";
import { getBranchDirectoryNumeral, type Branch, type Programme } from "@/content";
import { FreeTrialCta } from "@/components/home/FreeTrialCta";
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

  const directoryNumeral = getBranchDirectoryNumeral(branch.slug);
  const neighbourhood = `Coach-led sessions in ${branch.locality}. Ask on WhatsApp which batch fits you.`;

  return (
    <div className={styles.field}>
      <section
        className={styles.detailHero}
        aria-labelledby="branch-title"
        data-compose="branch-opening"
      >
        <HeroReveal className={styles.detailHeroGrid}>
          <div className={styles.detailOpening}>
            <p className={styles.detailKicker}>Ankit’s Studio</p>
            <h1 id="branch-title">{branch.locality}</h1>
            {addressLine ? <p className={styles.detailAddress}>{addressLine}</p> : null}
            <p>{neighbourhood}</p>
            <div className={styles.ctaRow}>
              <LocationPulseCta href={whatsappHref}>{whatsappLabel}</LocationPulseCta>
            </div>
          </div>
          <aside className={styles.detailRail} aria-label={`${branch.locality} locality`}>
            {directoryNumeral ? (
              <p className={styles.detailNum} aria-hidden="true">
                {directoryNumeral}
              </p>
            ) : null}
            <dl className={styles.detailFacts}>
              {branch.openingYear ? (
                <div>
                  <dt>Since</dt>
                  <dd>{branch.openingYear}</dd>
                </div>
              ) : null}
              {branch.openingStatus === "open" ? (
                <div>
                  <dt>Hours</dt>
                  <dd>Open daily · {hoursLabel}</dd>
                </div>
              ) : null}
              {branch.landmarks ? (
                <div>
                  <dt>Landmark</dt>
                  <dd>{branch.landmarks}</dd>
                </div>
              ) : null}
              {branch.nearestStation ? (
                <div>
                  <dt>Station</dt>
                  <dd>{branch.nearestStation}</dd>
                </div>
              ) : null}
            </dl>
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
          </aside>
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

      {(branch.landmarks ||
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
            {branch.landmarks ? (
              <li>
                <strong>On arrival</strong>
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

      <FreeTrialCta
        id="branch-final-cta"
        titleId="branch-final-cta-title"
        body={`Prefer ${branch.locality}? Message WhatsApp to book a free trial here.`}
        href={whatsappHref}
        label={whatsappLabel}
      />
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
