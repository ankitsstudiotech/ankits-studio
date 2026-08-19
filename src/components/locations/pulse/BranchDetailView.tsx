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
 * Confirmed branch detail — Concept A editorial profile + Concept B fact matrix.
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
  const hoursValue =
    branch.openingStatus === "open" ? `Open daily · ${hoursLabel}` : hoursLabel;

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
  const titleLines = splitLocality(branch.locality);

  const hereFacts: Array<{ label: string; body: string }> = [];
  if (branch.landmarks) {
    hereFacts.push({ label: "On arrival", body: branch.landmarks });
  }
  for (const note of branch.nearbyTransport ?? []) {
    hereFacts.push({ label: "Travel", body: note });
  }
  if (branch.parking) {
    hereFacts.push({ label: "Parking", body: branch.parking });
  }
  if (branch.facilities && branch.facilities.length > 0) {
    hereFacts.push({ label: "Available", body: branch.facilities.join(" · ") });
  }
  hereFacts.push({ label: "Not available", body: "Lift" });

  const batchFacts: Array<{ label: string; body: string }> = [];
  if (branch.ladiesOnlyBatchesAvailable) {
    batchFacts.push({
      label: "Ladies-only",
      body: "Available as a batch option — ask WhatsApp for current fit.",
    });
  }
  if (branch.kidsOnlyBatchesAvailable) {
    batchFacts.push({
      label: "Kids-only",
      body: "Available as a batch option — ask WhatsApp for current fit.",
    });
  }
  if (branch.maxGroupBatchSize != null) {
    batchFacts.push({
      label: "Group size",
      body: `Group batches are typically up to ${branch.maxGroupBatchSize} people`,
    });
  }

  return (
    <div className={styles.field}>
      <section
        className={styles.detailHero}
        aria-labelledby="branch-title"
        data-compose="branch-opening"
      >
        <div className={styles.detailWrap}>
          <div className={styles.detailHeroGrid}>
            <HeroReveal className={styles.detailOpening}>
              <p className={styles.detailKicker}>Ankit’s Studio</p>
              <h1 id="branch-title" className={styles.detailTitle}>
                {titleLines.map((line) => (
                  <span key={line} className={styles.detailTitleLine}>
                    {line}
                  </span>
                ))}
              </h1>
              {branch.openingYear ? (
                <dl className={styles.heroSince}>
                  <div>
                    <dt>Since</dt>
                    <dd>{branch.openingYear}</dd>
                  </div>
                </dl>
              ) : null}
              <p className={styles.heroLede}>{neighbourhood}</p>
              <div className={styles.ctaRow}>
                <LocationPulseCta href={whatsappHref}>{whatsappLabel}</LocationPulseCta>
              </div>
            </HeroReveal>
            <aside className={styles.detailRail} aria-label={`${branch.locality} directory number`}>
              {directoryNumeral ? (
                <p className={styles.detailNum}>{directoryNumeral}</p>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      {hoursValue || branch.landmarks || branch.nearestStation || branch.phone ? (
        <div className={styles.detailWrap}>
          <dl className={styles.factStrip}>
            {hoursValue ? (
              <div className={styles.factCell}>
                <dt>Hours</dt>
                <dd>{hoursValue}</dd>
              </div>
            ) : null}
            {branch.landmarks ? (
              <div className={styles.factCell}>
                <dt>Landmark</dt>
                <dd>{branch.landmarks}</dd>
              </div>
            ) : null}
            {branch.nearestStation ? (
              <div className={styles.factCell}>
                <dt>Station</dt>
                <dd>{branch.nearestStation}</dd>
              </div>
            ) : null}
            {branch.phone ? (
              <div className={styles.factCell}>
                <dt>Phone / WhatsApp</dt>
                <dd>
                  <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className={styles.factLink}>
                    {branch.phone}
                  </a>
                </dd>
                {branch.inheritsCentralEnquiry ? (
                  <p className={styles.placeMeta}>Shared enquiry number across all branches</p>
                ) : null}
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}

      <section className={styles.mapsStrip} aria-labelledby="branch-address">
        <div className={styles.detailWrap}>
          <div className={styles.mapsGrid}>
            <div className={styles.mapsAddress}>
              <h2 id="branch-address" className="sr-only">
                Address
              </h2>
              <p className={styles.detailAddress}>
                {addressLine || "Message us on WhatsApp for the address."}
              </p>
            </div>
            {mapsUrl ? (
              <a
                href={mapsUrl}
                className={styles.mapsAction}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
                <span className={styles.mapsArrow} aria-hidden="true">
                  →
                </span>
              </a>
            ) : (
              <p className={styles.mapsFallback}>Message WhatsApp for directions to this studio.</p>
            )}
          </div>
        </div>
      </section>

      {hereFacts.length > 0 ? (
        <section className={styles.hereSection} aria-labelledby="branch-getting-here">
          <div className={styles.detailWrap}>
            <SectionReveal>
              <h2 id="branch-getting-here" className={styles.sectionTitle}>
                Getting here
              </h2>
            </SectionReveal>
            <ol className={styles.hereGrid}>
              {hereFacts.map((fact, index) => (
                <li key={`${fact.label}-${fact.body}`} className={styles.hereItem}>
                  <span className={styles.hereNum} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={styles.hereLabel}>{fact.label}</p>
                    <p className={styles.hereBody}>{fact.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section
        className={styles.progSection}
        data-discovery="service-index"
        aria-labelledby="branch-services"
      >
        <div className={styles.detailWrap}>
          <SectionReveal>
            <h2 id="branch-services" className={styles.progKicker}>
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
                  {programme.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.lowerSplit} aria-labelledby="branch-batches">
        <div className={styles.detailWrap}>
          <div className={styles.lowerGrid}>
            <div className={styles.lowerPane}>
              <h2 id="branch-batches" className={styles.sectionTitle}>
                Batch guidance
              </h2>
              <p className={styles.lowerLede}>
                Message WhatsApp with your preferred service and time — we confirm current batches when you
                enquire. Studios open {hoursLabel} every day.
              </p>
              {batchFacts.length > 0 ? (
                <dl className={styles.batchFacts}>
                  {batchFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.body}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
            {otherProgrammes.length > 0 ? (
              <section className={styles.lowerPane} aria-labelledby="branch-other-ways">
                <h2 id="branch-other-ways" className={styles.sectionTitle}>
                  Home, online &amp; corporate
                </h2>
                <ul className={styles.extendedLinks}>
                  {otherProgrammes.map((programme) => (
                    <li key={programme.slug}>
                      <Link href={`/programs/${programme.slug}`} className={styles.extendedLink}>
                        {programme.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </section>

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

function splitLocality(locality: string): string[] {
  const match = locality.match(/^(.*?)\s+(Sector\s+\d+)$/i);
  if (match?.[1] && match[2]) {
    return [match[1], match[2]];
  }
  return [locality];
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
