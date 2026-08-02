import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
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
  "Learn about the free trial and one-time registration fee, and request current programme pricing from Ankit’s Studio through WhatsApp.";

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
    answer: "Yes. Your trial class is free. Opening WhatsApp starts a chat — it does not mean your enquiry was submitted.",
  },
  {
    id: "faq-registration",
    question: "Is there a registration fee?",
    answer:
      "Yes. A one-time registration fee of ₹300 applies after you join. It is not a monthly fee and not a trial charge.",
  },
  {
    id: "faq-why-no-list",
    question: "Why are exact programme fees not displayed?",
    answer:
      "Programme fees vary by service, format and training requirement. Exact monthly and longer-term amounts have not been published yet — message us for the current fee.",
  },
  {
    id: "faq-how-to-get",
    question: "How can I get the current fee for a programme?",
    answer:
      "Use the enquiry form on this page or WhatsApp. Include the service you want, and a preferred branch for studio classes when you can.",
  },
  {
    id: "faq-home-online",
    question: "Are Home Personal Training and Online Training priced differently?",
    answer:
      "They are separate delivery modes, not branch-floor classes. Their fees are confirmed when you enquire — we do not publish package amounts here yet.",
  },
] as const;

/**
 * Honest pricing page — confirmed facts only; programme fees via WhatsApp.
 * Does not render membership plan tiers (mock or otherwise).
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

      <PageBreadcrumb items={breadcrumbTrail} />

      <section className={styles.band} aria-labelledby="pricing-title">
        <p className={styles.kicker}>Pricing</p>
        <h1 id="pricing-title" className={styles.title}>
          Fees &amp; free trial
        </h1>
        <p className={styles.lede}>
          Your trial class is free. A one-time registration fee of ₹300 applies. Programme fees vary
          by service, format and training requirement. Message us for the current fee.
        </p>
      </section>

      <section className={styles.band} aria-labelledby="confirmed-fees-title">
        <h2 id="confirmed-fees-title" className={styles.sectionTitle}>
          Confirmed
        </h2>
        <ul className={styles.confirmedList}>
          <li className={styles.confirmedItem}>
            <p className={styles.kicker}>Trial</p>
            <p className={styles.feeAmount}>
              {commercial.trialIsFree ? "Free" : "To be confirmed"}
            </p>
            <p className={styles.feeMeta}>Trial class — not a paid membership plan.</p>
          </li>
          {typeof registrationFee === "number" ? (
            <li className={styles.confirmedItem}>
              <p className={styles.kicker}>Registration</p>
              <p className={styles.feeAmount}>₹{registrationFee}</p>
              <p className={styles.feeMeta}>
                One-time registration fee after you join. Not a monthly fee, not a trial charge, and
                not a recurring charge.
              </p>
            </li>
          ) : null}
          <li className={styles.confirmedItem}>
            <p className={styles.kicker}>Programme fees</p>
            <p className={styles.feeMeta}>
              Fees vary by service. Exact amounts are shared when you enquire — we do not publish
              invented monthly or package prices.
            </p>
          </li>
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="why-varies-title">
        <h2 id="why-varies-title" className={styles.sectionTitle}>
          What affects pricing
        </h2>
        <p className={styles.lede}>
          The right fee depends on the service you choose and how you train. We do not claim fees
          differ by branch unless confirmed, and we do not publish GST, discounts, or refund policies
          here yet.
        </p>
      </section>

      <section className={styles.band} aria-labelledby="pricing-enquiry-title">
        <h2 id="pricing-enquiry-title" className={styles.sectionTitle}>
          Request current fees
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

      <section className={styles.band} aria-labelledby="pending-policies-title">
        <h2 id="pending-policies-title" className={styles.sectionTitle}>
          Still being updated
        </h2>
        <p className={styles.lede}>
          These details are not published yet. Ask on WhatsApp if you need them for your decision —
          we will not invent amounts on this page.
        </p>
        <ul className={styles.pendingList}>
          <li>Monthly, quarterly, half-yearly and annual programme fees</li>
          <li>Personal-training package amounts</li>
          <li>Wedding Choreography package amounts</li>
          <li>Home Personal Training and Online Training charges</li>
          <li>Discounts, refunds, cancellations and membership policies</li>
        </ul>
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
