import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { RouteOpening } from "@/components/motion";
import { PricingEnquiryBuilder } from "@/components/pricing/pulse/PricingEnquiryBuilder";
import styles from "@/components/pricing/pulse/pricing.module.css";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioCommercial,
} from "@/content";
import { getPrimaryConversionHref } from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

const PATH = "/pricing";

const PAGE_DESCRIPTION =
  "Free trial once per person, ₹300 one-time registration, and programme fees that vary by service and branch. Ask Ankit’s Studio for the current fee on WhatsApp.";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing & Free Trial",
  description: PAGE_DESCRIPTION,
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: PATH },
];

const FAQ = [
  {
    id: "faq-trial-free",
    question: "Is the trial class free?",
    answer:
      "Yes. A free trial is available for every service at every physical branch, once per person. Message us on WhatsApp to book.",
  },
  {
    id: "faq-registration",
    question: "Is there a registration fee?",
    answer:
      "Yes. A one-time registration fee of ₹300 per person applies after you join. It is not charged again after a membership break. It is not a monthly fee and not a trial charge.",
  },
  {
    id: "faq-why-no-list",
    question: "How do I get the current programme fee?",
    answer:
      "Programme fees vary by service and branch. Tell us what you’re interested in and we’ll share the current fee on WhatsApp. GST is included in the fee quoted by the studio.",
  },
  {
    id: "faq-home-online",
    question: "Are Home Personal Training and Online Training priced differently?",
    answer:
      "Home Personal Training is priced per session. Online Training uses Zoom (one-to-one and group). Message us for the current rates.",
  },
  {
    id: "faq-wedding",
    question: "How is Wedding Choreography priced?",
    answer: "Wedding Choreography pricing is arranged per couple. Message us for current details.",
  },
] as const;

/**
 * Honest pricing page — confirmed facts only; programme fees via WhatsApp.
 */
export default function PricingPage() {
  const commercial = getStudioCommercial();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const fallbackHref = getPrimaryConversionHref();

  const physical = programmes.filter((p) => p.deliveryMode === "in-studio");
  const delivery = programmes.filter(
    (p) => p.deliveryMode === "home" || p.deliveryMode === "online",
  );

  const services = programmes.map((programme) => ({
    slug: programme.slug,
    name: programme.name,
    deliveryMode:
      programme.deliveryMode === "home" || programme.deliveryMode === "online"
        ? programme.deliveryMode
        : ("in-studio" as const),
  }));

  const branchOptions = branches.map((branch) => ({
    slug: branch.slug,
    locality: branch.locality,
  }));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: "Pricing & Free Trial",
    description: PAGE_DESCRIPTION,
    path: PATH,
  });

  const registrationFee = commercial.registrationFeeInr;

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

      <section className={`${styles.band} ${styles.bandWide} ${styles.splitBand}`} aria-labelledby="pricing-title">
        <div>
          <RouteOpening>
            <p className={styles.kicker}>Pricing</p>
            <h1 id="pricing-title" className={styles.title}>
              Fees &amp; free trial
            </h1>
            <p className={styles.lede}>
              Your trial class is free for every service at every physical branch — once per person. A
              one-time registration fee of ₹300 per person applies after you join and is not charged again
              after a membership break. Programme fees vary by service and branch. Tell us what you’re
              interested in and we’ll share the current fee on WhatsApp. GST is included in the fee
              quoted by the studio.
            </p>
          </RouteOpening>

          <h2 id="confirmed-fees-title" className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
            What we can confirm today
          </h2>
          <ul className={styles.confirmedList}>
            <li className={styles.confirmedItem}>
              <p className={styles.kicker}>Trial</p>
              <p className={styles.feeAmount}>
                {commercial.trialIsFree ? "Free" : "Ask on WhatsApp"}
              </p>
              <p className={styles.feeMeta}>
                Free for every service and physical branch, once per person. Advance booking is not
                compulsory, but checking WhatsApp availability is recommended.
              </p>
            </li>
            {typeof registrationFee === "number" ? (
              <li className={styles.confirmedItem}>
                <p className={styles.kicker}>Registration</p>
                <p className={styles.feeAmount}>₹{registrationFee}</p>
                <p className={styles.feeMeta}>
                  One-time registration fee per person after you join. Not recharged after a membership
                  break. Not a monthly fee, not a trial charge, and not a recurring charge.
                </p>
              </li>
            ) : null}
            <li className={styles.confirmedItem}>
              <p className={styles.kicker}>Programme fees</p>
              <p className={styles.feeMeta}>
                Programme fees vary by service and branch. Tell us what you’re interested in and we’ll
                share the current fee on WhatsApp. GST is included in the fee quoted by the studio.
              </p>
            </li>
            <li className={styles.confirmedItem}>
              <p className={styles.kicker}>How some services are priced</p>
              <p className={styles.feeMeta}>
                Wedding Choreography is priced per couple. Home Personal Training is priced per session.
                Online Training uses Zoom (one-to-one and group). Message us for the current rates.
              </p>
            </li>
          </ul>
        </div>

        <section
          id="pricing-enquiry"
          className={styles.enquiryPanel}
          aria-labelledby="pricing-enquiry-title"
        >
          <h2 id="pricing-enquiry-title" className={styles.sectionTitle}>
            Ask for the current fee
          </h2>
          <p className={styles.lede}>
            Prepare a WhatsApp message for the service you want. You do not need every field filled in
            before you open the chat.
          </p>
          <PricingEnquiryBuilder
            services={services}
            branches={branchOptions}
            fallbackHref={fallbackHref}
          />
        </section>
      </section>

      <section className={styles.band} aria-labelledby="pricing-faq-title">
        <h2 id="pricing-faq-title" className={styles.sectionTitle}>
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

      <section className={`${styles.band} ${styles.bandWide}`} aria-labelledby="pricing-links-title">
        <h2 id="pricing-links-title" className={styles.sectionTitle}>
          Programmes &amp; locations
        </h2>
        <div className={styles.linkColumns}>
          <div>
            <p className={styles.kicker}>Studio services</p>
            <ul className={styles.linkList}>
              {physical.map((programme) => (
                <li key={programme.slug}>
                  <Link href={`/programs/${programme.slug}`}>{programme.name}</Link>
                </li>
              ))}
            </ul>
            {delivery.length > 0 ? (
              <>
                <p className={styles.kicker} style={{ marginTop: "1.25rem" }}>
                  Other ways to train
                </p>
                <ul className={styles.linkList}>
                  {delivery.map((programme) => (
                    <li key={programme.slug}>
                      <Link href={`/programs/${programme.slug}`}>{programme.name}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className={styles.deliveryNote}>
              <Link href="/programs">Browse all programmes</Link>
            </p>
          </div>
          <div>
            <p className={styles.kicker}>Branches</p>
            <ul className={styles.linkList}>
              {branches.map((branch) => (
                <li key={branch.slug}>
                  <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
                </li>
              ))}
            </ul>
            <p className={styles.deliveryNote}>
              <Link href="/locations">All locations</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
