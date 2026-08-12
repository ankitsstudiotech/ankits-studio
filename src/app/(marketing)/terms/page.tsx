import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/pulse/LegalPage";
import styles from "@/components/legal/pulse/legal.module.css";
import { getStudioCommercial } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/terms";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of use",
  description:
    "Terms for using the Ankit’s Studio website — general information, enquiries and third-party links.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Terms", path: PATH },
];

export default function TermsPage() {
  const commercial = getStudioCommercial();
  const policies = commercial.membershipPolicyCopy;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <LegalPage title="Terms of use" breadcrumbTrail={breadcrumbTrail}>
        <h2 className={styles.sectionTitle}>Website information</h2>
        <p className={styles.body}>
          Content on this website is general information about Ankit’s Studio programmes, branches
          and how to enquire. Fees and batch availability should be confirmed directly with the
          studio. Information may be updated without notice.
        </p>

        <h2 className={styles.sectionTitle}>Enquiries and trials</h2>
        <p className={styles.body}>
          Opening a WhatsApp link does not complete a booking by itself. You review and send any
          message in WhatsApp. A free trial remains subject to current branch and batch availability.
          Advance booking is optional; checking availability on WhatsApp is recommended.
        </p>

        <h2 className={styles.sectionTitle}>Fitness and health</h2>
        <p className={styles.body}>
          Fitness participation is voluntary. This website does not provide medical diagnosis or
          treatment. Choose activities that suit you, and seek appropriate professional advice where
          necessary.
        </p>

        {policies ? (
          <>
            <h2 id="membership-policies" className={styles.sectionTitle}>
              Membership policies
            </h2>
            <p className={styles.body}>
              The following summaries apply to studio memberships. They are general information only
              and are not legal advice. Terms communicated at enrolment prevail.
            </p>
            <h3 className={styles.sectionTitle}>Cancellation</h3>
            <p className={styles.body}>{policies.cancellation}</p>
            <h3 className={styles.sectionTitle}>Refunds</h3>
            <p className={styles.body}>{policies.refund}</p>
            <h3 className={styles.sectionTitle}>Transfer between branches</h3>
            <p className={styles.body}>{policies.transfer}</p>
            <h3 className={styles.sectionTitle}>Freeze or pause</h3>
            <p className={styles.body}>{policies.freeze}</p>
            <h3 className={styles.sectionTitle}>Membership expiry</h3>
            <p className={styles.body}>{policies.expiry}</p>
          </>
        ) : null}

        <h2 className={styles.sectionTitle}>Third-party services</h2>
        <p className={styles.body}>
          Links to WhatsApp, Google Maps, phone and email open third-party applications or services.
          Those services have their own terms and privacy practices.
        </p>

        <h2 className={styles.sectionTitle}>Intellectual property</h2>
        <p className={styles.body}>
          Branding, logos and site content belonging to Ankit’s Studio may not be copied or reused
          without permission, except where the law allows.
        </p>

        <h2 className={styles.sectionTitle}>Contact</h2>
        <p className={styles.body}>
          Questions about these terms:{" "}
          <a href="mailto:ankitsstudio5@gmail.com" className={styles.link}>
            ankitsstudio5@gmail.com
          </a>
          .
        </p>
      </LegalPage>
    </>
  );
}
