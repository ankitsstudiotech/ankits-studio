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

/** Only questions not already answered in the commercial-facts block. */
const FAQ = [
  {
    id: "faq-branch-fees",
    question: "Do fees differ by branch?",
    answer:
      "Yes. Programme fees vary by service and branch. Tell us both when you enquire and we’ll share the current fee.",
  },
  {
    id: "faq-wedding",
    question: "How is Wedding Choreography priced?",
    answer: "Wedding Choreography pricing is arranged per couple. Message us for current details.",
  },
  {
    id: "faq-home-online",
    question: "How is Home Personal Training priced?",
    answer:
      "Home Personal Training is priced per session. Online Training uses Zoom (one-to-one and group). Message us for the current rates.",
  },
] as const;

/**
 * Honest pricing page — commercial facts + enquiry builder as the centre.
 */
export default function PricingPage() {
  const commercial = getStudioCommercial();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const fallbackHref = getPrimaryConversionHref();

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
              Start with a free trial. Programme fees vary by service and branch — ask on WhatsApp for
              the current amount. GST is included in the fee the studio quotes.
            </p>
          </RouteOpening>

          <h2 id="confirmed-fees-title" className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
            What applies today
          </h2>
          <ul className={styles.confirmedList}>
            <li className={styles.confirmedItem}>
              <p className={styles.kicker}>Trial</p>
              <p className={styles.feeAmount}>
                {commercial.trialIsFree ? "Free" : "Ask on WhatsApp"}
              </p>
              <p className={styles.feeMeta}>Once per person, every service and physical branch.</p>
            </li>
            {typeof registrationFee === "number" ? (
              <li className={styles.confirmedItem}>
                <p className={styles.kicker}>Registration</p>
                <p className={styles.feeAmount}>₹{registrationFee}</p>
                <p className={styles.feeMeta}>
                  One-time per person after you join. Not recharged after a membership break. Not a monthly fee and not a trial charge.
                </p>
              </li>
            ) : null}
            <li className={styles.confirmedItem}>
              <p className={styles.kicker}>Programme fees</p>
              <p className={styles.feeMeta}>
                {commercial.pricingEnquiryNote ??
                  "Vary by service and branch. GST is included in the fee quoted by the studio."}{" "}
                Wedding Choreography is priced per couple; Home PT per session; Online Training on
                Zoom; Corporate Wellness on enquiry.
              </p>
            </li>
            {commercial.discountsEnquiryNote ? (
              <li className={styles.confirmedItem}>
                <p className={styles.kicker}>Offers</p>
                <p className={styles.feeMeta}>{commercial.discountsEnquiryNote}</p>
              </li>
            ) : null}
          </ul>

          {commercial.membershipPolicyCopy ? (
            <>
              <h2
                id="membership-policies-title"
                className={styles.sectionTitle}
                style={{ marginTop: "2rem" }}
              >
                Membership policies
              </h2>
              <ul className={styles.faqList}>
                <li>
                  <h3>Cancellation</h3>
                  <p>{commercial.membershipPolicyCopy.cancellation}</p>
                </li>
                <li>
                  <h3>Refunds</h3>
                  <p>{commercial.membershipPolicyCopy.refund}</p>
                </li>
                <li>
                  <h3>Transfer between branches</h3>
                  <p>{commercial.membershipPolicyCopy.transfer}</p>
                </li>
                <li>
                  <h3>Freeze or pause</h3>
                  <p>{commercial.membershipPolicyCopy.freeze}</p>
                </li>
                <li>
                  <h3>Membership expiry</h3>
                  <p>{commercial.membershipPolicyCopy.expiry}</p>
                </li>
              </ul>
              <p className={styles.feeMeta} style={{ marginTop: "1rem" }}>
                These summaries are for general information. Full terms are communicated at enrolment.{" "}
                <Link href="/terms#membership-policies" className={styles.ctaSecondary}>
                  Read terms
                </Link>
              </p>
            </>
          ) : null}
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

      <section className={styles.band} aria-labelledby="pricing-next-title">
        <h2 id="pricing-next-title" className={styles.sectionTitle}>
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
