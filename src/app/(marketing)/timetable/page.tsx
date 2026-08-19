import type { Metadata } from "next";
import Link from "next/link";
import { FaqBlock } from "@/components/content/FaqBlock";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { RouteOpening } from "@/components/motion";
import { AvailabilityEnquiryBuilder } from "@/components/timetable/pulse/AvailabilityEnquiryBuilder";
import styles from "@/components/timetable/pulse/batch-availability.module.css";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioCommercial,
} from "@/content";
import { getPrimaryConversionHref } from "@/lib/conversion";
import type { AvailabilityDeliveryMode } from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

const PATH = "/timetable";

const PAGE_DESCRIPTION =
  "Check current class availability across Ankit’s Studio branches and enquire about a free trial through WhatsApp. Studios operate 6:00 AM–10:00 PM — that window is not a class timetable.";

export const metadata: Metadata = buildPageMetadata({
  title: "Batch Availability",
  description: PAGE_DESCRIPTION,
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Batch Availability", path: PATH },
];

/** Secondary questions only — hours + “batches vary” already visible above. */
const FAQ = [
  {
    id: "faq-walk-in",
    question: "Do I need to book in advance for a trial?",
    answer:
      "Advance booking is optional; checking availability on WhatsApp is recommended.",
  },
  {
    id: "faq-trial",
    question: "Can I book a free trial while asking about batches?",
    answer:
      "Yes. The WhatsApp enquiry can cover both current availability and a free trial.",
  },
] as const;

/**
 * Batch Availability — Concept B fact matrix + Concept A lower editorial split.
 */
export default function TimetablePage() {
  const branches = getPubliclyListedBranches();
  const programmes = getConfirmedProgrammes();
  const commercial = getStudioCommercial();
  const fallbackHref = getPrimaryConversionHref();

  const services = programmes.map((programme) => ({
    slug: programme.slug,
    name: programme.name,
    deliveryMode: (programme.deliveryMode === "home" || programme.deliveryMode === "online"
      ? programme.deliveryMode
      : "in-studio") as AvailabilityDeliveryMode,
  }));

  const branchOptions = branches.map((branch) => ({
    slug: branch.slug,
    locality: branch.locality,
  }));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: "Batch Availability",
    description: PAGE_DESCRIPTION,
    path: PATH,
  });

  const audienceSupport =
    commercial.ladiesOnlyBatchesAvailable || commercial.kidsOnlyBatchesAvailable
      ? "Available as options — exact branch and programme fit is confirmed when you enquire."
      : "Ask on WhatsApp about audience options for your preferred programme.";

  return (
    <PageWithFooter>
    <main className={`${styles.page} flex flex-col`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }}
      />

      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <div className={styles.wrap}>
        <header className={styles.hero} aria-labelledby="batch-availability-title">
          <div className={styles.heroInner}>
            <RouteOpening>
              <p className={styles.kicker}>Batch availability</p>
              <h1 id="batch-availability-title" className={styles.title}>
                Check current batches
              </h1>
              <p className={styles.heroLede}>
                Batch times vary by branch and programme. Choose your preferences and we’ll confirm the
                current options on WhatsApp.
              </p>
            </RouteOpening>
          </div>
        </header>

        <div className={styles.matrix} role="list">
          <div className={styles.matrixCell} role="listitem">
            <h2 id="operating-hours-title" className={styles.factLabel}>
              Studio operating hours
            </h2>
            <p className={styles.factValueLarge}>6:00 AM to 10:00 PM · every day</p>
            <p className={styles.factSupport}>These are studio hours; individual batches vary.</p>
          </div>
          <div className={styles.matrixCell} role="listitem">
            <h2 id="audience-notes-title" className={styles.factLabel}>
              Audience &amp; group size
            </h2>
            <p className={styles.factValue}>Ladies-only and kids-only</p>
            <p className={styles.factSupport}>{audienceSupport}</p>
          </div>
          {commercial.maxGroupBatchSize != null ? (
            <div className={styles.matrixCell} role="listitem">
              <h2 className={styles.factLabel}>Maximum group batch size</h2>
              <p className={styles.factValue}>
                Up to {commercial.maxGroupBatchSize} people in a typical group batch.
              </p>
            </div>
          ) : null}
        </div>

        <section
          id="availability-enquiry"
          className={styles.enquiry}
          aria-labelledby="enquiry-builder-title"
        >
          <div className={styles.enquiryIntro}>
            <h2 id="enquiry-builder-title" className={styles.enquiryTitle}>
              Availability enquiry
            </h2>
            <p className={styles.enquiryLede}>
              Prepare a WhatsApp message for the service you want. You do not need every field filled in
              before you open the chat.
            </p>
          </div>
          <div className={styles.enquiryPanel}>
            <AvailabilityEnquiryBuilder
              services={services}
              branches={branchOptions}
              fallbackHref={fallbackHref}
            />
          </div>
        </section>

        <div className={styles.know}>
          <FaqBlock items={[...FAQ]} titleId="batch-faq-title" />
        </div>

        <nav className={styles.next} aria-labelledby="batch-next-title">
          <h2 id="batch-next-title" className={styles.nextLabel}>
            Next steps
          </h2>
          <div className={styles.nextLinks}>
            <Link className={styles.nextLink} href="/programs">
              Explore programmes
              <span className={styles.nextArrow} aria-hidden="true">
                →
              </span>
            </Link>
            <span className={styles.nextSlash} aria-hidden="true">
              /
            </span>
            <Link className={styles.nextLink} href="/locations">
              Find a studio
              <span className={styles.nextArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </main>
    </PageWithFooter>
  );
}
