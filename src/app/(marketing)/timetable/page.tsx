import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
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
 * Batch Availability — calm utility page centred on the enquiry builder.
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

  return (
    <main className={`${styles.page} flex flex-1 flex-col`}>
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

      <section
        className={`${styles.band} ${styles.bandWide} ${styles.splitBand}`}
        aria-labelledby="batch-availability-title"
      >
        <div>
          <RouteOpening>
            <p className={styles.kicker}>Batch availability</p>
            <h1 id="batch-availability-title" className={styles.title}>
              Check current batches
            </h1>
            <p className={styles.lede}>
              Batch times vary by branch and programme. Choose your preferences and we’ll confirm the
              current options on WhatsApp.
            </p>
          </RouteOpening>

          <h2 id="operating-hours-title" className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
            Studio operating hours
          </h2>
          <div className={styles.hoursBox}>
            <p className={styles.hoursValue}>6:00 AM to 10:00 PM · every day</p>
            <p className={styles.lede}>
              These are studio hours; individual batches vary.
            </p>
          </div>
        </div>

        <section
          id="availability-enquiry"
          className={styles.enquiryPanel}
          aria-labelledby="enquiry-builder-title"
        >
          <h2 id="enquiry-builder-title" className={styles.sectionTitle}>
            Availability enquiry
          </h2>
          <p className={styles.lede}>
            Prepare a WhatsApp message for the service you want. You do not need every field filled in
            before you open the chat.
          </p>
          <AvailabilityEnquiryBuilder
            services={services}
            branches={branchOptions}
            fallbackHref={fallbackHref}
          />
        </section>
      </section>

      <section className={styles.band} aria-labelledby="audience-notes-title">
        <h2 id="audience-notes-title" className={styles.sectionTitle}>
          Audience &amp; group size
        </h2>
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <strong>Ladies-only and kids-only</strong>
            {commercial.ladiesOnlyBatchesAvailable || commercial.kidsOnlyBatchesAvailable
              ? "Available as options — exact branch and programme fit is confirmed when you enquire."
              : "Ask on WhatsApp about audience options for your preferred programme."}
          </li>
          {commercial.maxGroupBatchSize != null ? (
            <li className={styles.fact}>
              <strong>Maximum group batch size</strong>
              Up to {commercial.maxGroupBatchSize} people in a typical group batch.
            </li>
          ) : null}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="batch-faq-title">
        <h2 id="batch-faq-title" className={styles.sectionTitle}>
          FAQ
        </h2>
        <ul className={styles.faqList}>
          {FAQ.map((item) => (
            <li key={item.id}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="batch-next-title">
        <h2 id="batch-next-title" className={styles.sectionTitle}>
          Next steps
        </h2>
        <div className={styles.ctaRow}>
          <Link className={styles.ctaSecondary} href="/programs">
            Explore programmes
          </Link>
          <Link className={styles.ctaSecondary} href="/locations">
            Find a studio
          </Link>
        </div>
      </section>
    </main>
  );
}
