import type { Metadata } from "next";
import Link from "next/link";
import { FaqBlock } from "@/components/content/FaqBlock";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
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
  const programmeFeeCopy = `${commercial.pricingEnquiryNote ??
    "Vary by service and branch. GST is included in the fee quoted by the studio."} Wedding Choreography is priced per couple; Home PT per session; Online Training on Zoom; Corporate Wellness on enquiry.`;

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
        <header className={styles.hero} aria-labelledby="pricing-title">
          <RouteOpening>
            <h1 id="pricing-title" className={styles.title}>
              Fees &amp; free trial
            </h1>
            <p className={styles.heroLede}>
              Start with a free trial. Programme fees vary by service and branch — ask on WhatsApp for
              the current amount. GST is included in the fee the studio quotes.
            </p>
          </RouteOpening>
        </header>

        <div className={styles.primary}>
          <section className={styles.factsCol} aria-labelledby="confirmed-fees-title">
            <h2 id="confirmed-fees-title" className={styles.factsKicker}>
              What applies today
            </h2>

            <div className={styles.heroNumbers}>
              <div className={styles.fact}>
                <p className={styles.factLabelAccent}>Trial</p>
                <p className={styles.factValue}>
                  {commercial.trialIsFree ? "Free" : "Ask on WhatsApp"}
                </p>
                <p className={styles.factCopy}>Once per person, every service and physical branch.</p>
              </div>
              {typeof registrationFee === "number" ? (
                <div className={styles.fact}>
                  <p className={styles.factLabel}>Registration</p>
                  <p className={styles.factValue}>₹{registrationFee}</p>
                  <p className={styles.factCopy}>
                    One-time per person after you join. Not recharged after a membership break. Not a monthly fee and not a trial charge.
                  </p>
                </div>
              ) : null}
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoRow}>
                <h3 className={styles.infoTitle}>Programme fees</h3>
                <p className={styles.infoCopy}>{programmeFeeCopy}</p>
              </div>
              {commercial.discountsEnquiryNote ? (
                <div className={styles.infoRow}>
                  <h3 className={styles.infoTitle}>Offers</h3>
                  <p className={styles.infoCopy}>{commercial.discountsEnquiryNote}</p>
                </div>
              ) : null}
            </div>
          </section>

          <section
            id="pricing-enquiry"
            className={styles.enquiryPanel}
            aria-labelledby="pricing-enquiry-title"
          >
            <span className={styles.formMark} aria-hidden="true" />
            <h2 id="pricing-enquiry-title" className={styles.enquiryTitle}>
              Ask for the current fee
            </h2>
            <p className={styles.enquiryLede}>
              Prepare a WhatsApp message for the service you want. You do not need every field filled in
              before you open the chat.
            </p>
            <PricingEnquiryBuilder
              services={services}
              branches={branchOptions}
              fallbackHref={fallbackHref}
            />
          </section>
        </div>

        {commercial.membershipPolicyCopy ? (
          <div className={styles.lower}>
            <section className={styles.policyCol} aria-labelledby="membership-policies-title">
              <h2 id="membership-policies-title" className={styles.policyTitle}>
                Membership policies
              </h2>
              <ul className={styles.policyList}>
                <li className={styles.policyItem}>
                  <h3>Cancellation</h3>
                  <p>{commercial.membershipPolicyCopy.cancellation}</p>
                </li>
                <li className={styles.policyItem}>
                  <h3>Refunds</h3>
                  <p>{commercial.membershipPolicyCopy.refund}</p>
                </li>
                <li className={styles.policyItem}>
                  <h3>Transfer between branches</h3>
                  <p>{commercial.membershipPolicyCopy.transfer}</p>
                </li>
                <li className={styles.policyItem}>
                  <h3>Freeze or pause</h3>
                  <p>{commercial.membershipPolicyCopy.freeze}</p>
                </li>
                <li className={styles.policyItem}>
                  <h3>Membership expiry</h3>
                  <p>{commercial.membershipPolicyCopy.expiry}</p>
                </li>
              </ul>
              <p className={styles.policyNote}>
                These summaries are for general information. Full terms are communicated at enrolment.{" "}
                <Link href="/terms#membership-policies" className={styles.termsLink}>
                  Read terms
                </Link>
              </p>
            </section>

            <div className={styles.faqCol}>
              <FaqBlock items={[...FAQ]} titleId="pricing-faq-title" />
            </div>
          </div>
        ) : (
          <div className={styles.lower}>
            <div className={styles.faqCol}>
              <FaqBlock items={[...FAQ]} titleId="pricing-faq-title" />
            </div>
          </div>
        )}

        <nav className={styles.nextBand} aria-labelledby="pricing-next-title">
          <h2 id="pricing-next-title" className="sr-only">
            Next steps
          </h2>
          <Link className={styles.nextLink} href="/programs">
            <span className={styles.nextIndex}>01</span>
            <span className={styles.nextTitle}>
              Explore programmes
              <span className={styles.nextArrow} aria-hidden="true">
                →
              </span>
            </span>
          </Link>
          <Link className={styles.nextLink} href="/locations">
            <span className={styles.nextIndex}>02</span>
            <span className={styles.nextTitle}>
              Find a studio
              <span className={styles.nextArrow} aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        </nav>
      </div>
    </main>
    </PageWithFooter>
  );
}
